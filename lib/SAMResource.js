'use strict';

var http = require('http');
var https = require('https');
var path = require('path');
var when = require('when');

var utils = require('./utils');
var Error = require('./Error');

var hasOwn = {}.hasOwnProperty;

// Provide extension mechanism for SAM Resource Sub-Classes
SAMResource.extend = utils.protoExtend;

// Expose method-creator & prepared (basic) methods
SAMResource.method = require('./SAMMethod');
SAMResource.BASIC_METHODS = require('./SAMMethod.basic');

/**
 * Encapsulates request logic for a SAM Resource
 */
function SAMResource(sam, urlData) {

    this._sam = sam;
    this._urlData = urlData || {};

    this.basePath = utils.makeInterpolator('/' + this._getVersion() + '/');
    this.path = utils.makeInterpolator(this.path);

    if (this.includeBasic) {
        this.includeBasic.forEach(function(methodName) {
            this[methodName] = SAMResource.BASIC_METHODS[methodName];
        }, this);
    }

    this.initialize.apply(this, arguments);
}

SAMResource.prototype = {

    path: '',

    initialize: function() {},

    _getHost: function() {
        return this._sam._getApiField('host');
    },

    _getPort: function() {
        return this._sam._getApiField('port');
    },

    _getVersion: function() {
        return this._sam._getApiField('version');
    },

    createFullPath: function(commandPath, urlData) {
        return path.join(
            this.basePath(urlData),
            this.path(urlData),
            typeof commandPath == 'function' ?
                commandPath(urlData) : commandPath
        ).replace(/\\/g, '/'); // ugly workaround for Windows
    },

    createUrlData: function() {
        var urlData = {};

        // Merge in baseData
        for (var i in this._urlData) {
            if (hasOwn.call(this._urlData, i)) {
                urlData[i] = this._urlData[i];
            }
        }

        return urlData;
    },

    createDeferred: function(callback) {
        var deferred = when.defer();

        if (callback) {
            // Callback, if provided, is a simply translated to Promise'esque:
            // (Ensure callback is called outside of promise stack)
            deferred.promise.then(function(res) {
                setTimeout(function(){ callback(null, res) }, 0);
            }, function(err) {
                setTimeout(function(){ callback(err, null); }, 0);
            });
        }

        return deferred;
    },

    _timeoutHandler: function(timeout, req, callback) {
        var self = this;
        return function() {
            var timeoutErr = new Error('ETIMEDOUT');
            timeoutErr.code = 'ETIMEDOUT';

            req._isAborted = true;
            req.abort();

            callback.call(
                self,
                new Error.SAMConnectionError({
                    message: 'Request aborted due to timeout being reached (' + timeout + 'ms)',
                    detail: timeoutErr
                }),
                null
            );
        }
    },

    _responseHandler: function(req, callback) {
        var self = this;
        return function(res) {
            var response = '';

            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                response += chunk;
            });
            res.on('end', function() {
                if (response) {
                    try {
                        response = JSON.parse(response);
                        if (response.error) {
                            var err;
                            if (res.statusCode === 401) {
                                err = new Error.SAMAuthenticationError(response.error);
                            } else {
                                err = Error.SAMError.generate(response.error);
                            }
                            return callback.call(self, err, null);
                        }
                    } catch (e) {
                        return callback.call(
                            self,
                            new Error.SAMAPIError({
                                message: 'Invalid JSON received from the SAM API'
                            }),
                            null
                        );
                    }
                }
                callback.call(self, null, response);
            });
        };
    },

    _errorHandler: function(req, callback) {
        var self = this;
        return function(error) {
            if (req._isAborted) return; // already handled
            callback.call(
                self,
                new Error.SAMConnectionError({
                    message: 'An error occurred with our connection to SAM',
                    detail: error
                }),
                null
            );
        }
    },

    _request: function(method, path, headers, data, callback) {

        var query = utils.stringifyRequestData(data.query);

        var self = this;

        headers = utils.extend({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'SAM/v1 NodeBindings/' + this._sam._getConstant('PACKAGE_VERSION')
        }, headers);

        // Grab client-user-agent before making the request:
        this._sam._getClientUserAgent(function(cua) {

            headers['X-SAM-Client-User-Agent'] = cua;

            var timeout = self._sam._getApiField('timeout');

            var req = (self._sam._getApiField('protocol') == 'http' ? http : https)
                .request({
                    rejectUnauthorized: false,
                    host: self._getHost(),
                    port: self._getPort(),
                    path: path + '?' + query,
                    method: method,
                    headers: headers
                });

            if (data.body) {
                switch (headers['Content-Type']) {
                    case 'application/json':
                        data.body = JSON.stringify(data.body);
                        break;
                    case 'application/octet-stream':
                        // do nothing - assume it's a Buffer
                        break;
                }
                req.write(data.body);
            }

            req.setTimeout(timeout, self._timeoutHandler(timeout, req, callback));
            req.on('response', self._responseHandler(req, callback));
            req.on('error', self._errorHandler(req, callback));

            req.end();

        });

    }

};

module.exports = SAMResource;
