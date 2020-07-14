'use strict';

var SAM = require('../testUtils').getSpyableSAM;
var expect = require('chai').expect;

describe('User Resource', function () {

    describe('fetch', function () {

        it('Sends the correct request', function () {

            var sam = SAM({ access_token: 'fakeToken' });

            sam.user.fetch();
            expect(sam.LAST_REQUEST).to.deep.equal({
                method: 'GET',
                url: '/1/user',
                data: {
                    query: {
                        access_token: 'fakeToken'
                    }
                }
            });

        });

    });

});