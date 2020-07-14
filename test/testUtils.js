'use strict';

// NOTE: testUtils should be require'd before anything else in each spec file!

// Ensure we are using the 'as promised' libs before any tests are run:
require('mocha-as-promised')();
require('chai').use(require('chai-as-promised'));

var when = require('when');

var utils = module.exports = {

    getSpyableSAM: function (auth) {
        // Provide a testable SAM instance
        // That is, with mock-requests built in and hookable

        var SAM = require('../lib/sam');
        var samInstance = SAM(auth);

        samInstance.REQUESTS = [];

        for (var i in samInstance) {
            if (samInstance[i] instanceof SAM.SAMResource) {

                // Override each _request method so we can make the params
                // available to consuming tests (revealing requests made on
                // REQUESTS and LAST_REQUEST):
                samInstance[i]._request = function (method, url, headers, data, cb) {
                    var req = samInstance.LAST_REQUEST = {
                        method: method,
                        url: url,
                        data: data
                    };
                    samInstance.REQUESTS.push(req);
                    cb.call(this, null, {});
                };

            }
        }

        return samInstance;

    }

};



