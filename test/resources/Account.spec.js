'use strict';

var SAM = require('../testUtils').getSpyableSAM;
var expect = require('chai').expect;

describe('Account Resource', function () {

    describe('fetch', function () {

        it('Sends the correct request', function () {

            var sam = SAM({ api_key: 'fakeKey' });

            sam.account.fetch();
            expect(sam.LAST_REQUEST).to.deep.equal({
                method: 'GET',
                url: '/1/account',
                data: {
                    query: {
                        api_key: 'fakeKey'
                    }
                }
            });

        });

    });

    describe('users', function () {

        it('Sends the correct request', function () {

            var sam = SAM({ api_key: 'fakeKey' });

            sam.account.users();
            expect(sam.LAST_REQUEST).to.deep.equal({
                method: 'GET',
                url: '/1/account/users',
                data: {
                    query: {
                        api_key: 'fakeKey'
                    }
                }
            });

        });

    });

});