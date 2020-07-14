'use strict';

var async = require('async');

var SAMResource = require('../SAMResource');
var samMethod = SAMResource.method;

var utils = require('../utils');

module.exports = SAMResource.extend({

    _getHost: function() {
        return this._sam._getApiField('uploadHost');
    },

    _getPort: function() {
        return this._sam._getApiField('uploadPort');
    },

    _getVersion: function() {
        return this._sam._getApiField('uploadVersion');
    },

    path: 'upload',

    start: samMethod({
        method: 'POST'
    }),

    append: samMethod({
        method: 'POST',
        path: '/{mediaId}/append',
        urlParams: ['mediaId'],
        headers: {
            'Content-Type': 'application/octet-stream'
        },
        parseData: function(data) {
            return {
                query: { part: data.part },
                body: data.body
            };
        }
    }),

    complete: samMethod({
        method: 'POST',
        path: '/{mediaId}/complete',
        urlParams: ['mediaId']
    }),

    upload: function(params, options, callback) {

        var self = this;

        if (typeof(options) == 'function') {
            callback = options;
            options = {};
        }

        options = utils.extend({
            maxConcurrentParts: 5
        }, options);

        if (!params.media) {
            throw new Error('SAM: I require argument media.');
        }

        if (!(params.media instanceof Buffer)) {
            throw new Error('SAM: I require argument media be of type Buffer.');
        }

        if (!params.mimetype) {
            throw new Error('SAM: I require argument mimetype.');
        }

        var deferred = this.createDeferred(callback);

        // Start by calculating part size
        var size = params.media.length;
        var partSize = 5242880; // 5 MB
        var partCount = Math.max(Math.floor(size / partSize), 1);
        partSize = Math.ceil(size / partCount);

        async.waterfall([
            // Initialize the upload for this file
            function(cb) {
                self.start({
                    name: params.name,
                    size: size,
                    mimetype: params.mimetype,
                    parts: partCount
                }, function(err, response) {
                    if (err) return cb(err);
                    cb(null, response.media_id);
                });
            },
            // Break the file into parts and upload them
            function(mediaId, cb) {
                async.eachLimit(utils.range(partCount), options.maxConcurrentParts, function(index, cb) {

                    var partNumber = index + 1;
                    var start = index * partSize;
                    var end = start + Math.min(partSize, size - start);

                    var body = params.media.slice(start, end);

                    self.append(mediaId, {
                        part: partNumber,
                        body: body
                    }, function(err) {
                        cb(err);
                    });

                }, function(err) {
                    cb(err, mediaId);
                });
            },
            // The entire file is uploaded - complete the upload
            function(mediaId, cb) {
                self.complete(mediaId, function(err) {
                    cb(err, mediaId);
                });
            }
        ], function(err, mediaId) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(mediaId);
            }
        });

        return deferred.promise;

    }

});
