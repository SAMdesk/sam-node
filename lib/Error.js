'use strict';

var utils = require('./utils');

module.exports = _Error;

/**
 * Generic Error class to wrap any errors returned by sam-node
 */
function _Error(raw) {
    this.populate.apply(this, arguments);
}

// Extend Native Error
_Error.prototype = Object.create(Error.prototype);

_Error.prototype.type = 'GenericError';
_Error.prototype.populate = function(type, message) {
    this.type = type;
    this.message = message;
};

_Error.extend = utils.protoExtend;

/**
 * Create subclass of internal Error class
 * (Specifically for errors returned from SAM's REST API)
 */
var SAMError = _Error.SAMError = _Error.extend({
    type: 'SAMError',
    populate: function(raw) {

        // Move from prototype def (so it appears in stringified obj)
        this.type = this.type;

        this.rawType = raw.type;
        this.param = raw.param;
        this.message = raw.message;

    }
});

/**
 * Helper factory which takes raw sam errors and outputs wrapping instances
 */
SAMError.generate = function(rawSAMError) {
    switch (rawSAMError.type) {
        case 'invalid_request_error':
            return new _Error.SAMInvalidRequestError(rawSAMError);
        case 'api_error':
            return new _Error.SAMAPIError(rawSAMError);
    }
    return new _Error('Generic', 'Unknown Error');
};

// Specific SAM Error types:
_Error.SAMInvalidRequestError = SAMError.extend({ type: 'SAMInvalidRequest' });
_Error.SAMAPIError = SAMError.extend({ type: 'SAMAPIError' });
_Error.SAMAuthenticationError = SAMError.extend({ type: 'SAMAuthenticationError' });
_Error.SAMConnectionError = SAMError.extend({ type: 'SAMConnectionError' });
