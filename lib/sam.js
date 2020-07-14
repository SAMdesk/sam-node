'use strict';

var Error = require('./Error');
var utils = require('./utils');

// Use node's default timeout:
SAM.DEFAULT_TIMEOUT = require('http').createServer().timeout;
SAM.PACKAGE_VERSION = require('../package.json').version;

SAM.USER_AGENT = {
    bindings_version: SAM.PACKAGE_VERSION,
    lang: 'node',
    lang_version: process.version,
    platform: process.platform,
    publisher: 'sam',
    uname: null
};

SAM.USER_AGENT_SERIALIZED = null;

var exec = require('child_process').exec;

var defaults = {
    protocol: 'https',

    host: 'api.samdesk.io',
    port: 443,
    version: 1,

    uploadHost: 'upload.samdesk.io',
    uploadPort: 443,
    uploadVersion: 1,

    timeout: SAM.DEFAULT_TIMEOUT
};

var resources = {
    Account: require('./resources/Account'),
    Assets: require('./resources/Assets'),
    Stories: require('./resources/Stories'),
    Upload: require('./resources/Upload'),
    User: require('./resources/User')
};

SAM.SAMResource = require('./SAMResource');
SAM.resources = resources;

function SAM(auth, options) {

    if (!(this instanceof SAM)) {
        return new SAM(auth, options);
    }

    this._api = {
        auth: null,

        protocol: defaults.protocol,

        host: defaults.host,
        port: defaults.port,
        version: defaults.version,

        uploadHost: defaults.uploadHost,
        uploadPort: defaults.uploadPort,
        uploadVersion: defaults.uploadVersion,

        timeout: defaults.timeout,
        dev: false
    };

    // merge options into the _api object
    if (options) {
        utils.extend(this._api, options);
    }

    // prep the resources and add them to the SAM instance
    this._prepResources();

    this.setAuth(auth);
}

SAM.prototype = {

    setAuth: function(auth) {
        if (typeof(auth) === 'object') {
            if (auth.access_token && !auth.api_key) {
                this._setApiField('auth', { access_token: auth.access_token });
            } else if (auth.api_key && !auth.access_token) {
                this._setApiField('auth', { api_key: auth.api_key });
            } else {
                throw new Error.SAMError({ message: 'Invalid value for param "auth"' });
            }
        } else {
            throw new Error.SAMError({ message: 'Invalid value for param "auth"' });
        }
    },

    _setApiField: function(key, value) {
        this._api[key] = value;
    },

    _getApiField: function(key) {
        return this._api[key];
    },

    _getConstant: function(c) {
        return SAM[c];
    },

    _getClientUserAgent: function(cb) {
        if (SAM.USER_AGENT_SERIALIZED) {
            return cb(SAM.USER_AGENT_SERIALIZED);
        }
        exec('uname -a', function(err, uname) {
            SAM.USER_AGENT.uname = uname || 'UNKNOWN';
            SAM.USER_AGENT_SERIALIZED = JSON.stringify(SAM.USER_AGENT);
            cb(SAM.USER_AGENT_SERIALIZED);
        });
    },

    _prepResources: function() {
        for (var name in resources) {
            this[name[0].toLowerCase() + name.substring(1)] = new resources[name](this);
        }
    }
};

module.exports = SAM;
