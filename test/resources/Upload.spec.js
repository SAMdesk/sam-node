'use strict';

var SAM = require('../testUtils').getSpyableSAM;
var expect = require('chai').expect;

describe('Upload Resource', function () {

    describe('_getHost', function() {

        it('Returns the right value', function () {

            var sam = SAM({ access_token: 'fakeToken' });
            expect(sam.upload._getHost()).to.equal(sam._getApiField('uploadHost'))

        });

    });

    describe('_getPort', function() {

        it('Returns the right value', function () {

            var sam = SAM({ access_token: 'fakeToken' });
            expect(sam.upload._getPort()).to.equal(sam._getApiField('uploadPort'))

        });

    });

    describe('_getVersion', function() {

        it('Returns the right value', function () {

            var sam = SAM({ access_token: 'fakeToken' });
            expect(sam.upload._getVersion()).to.equal(sam._getApiField('uploadVersion'))

        });

    });

    describe('start', function() {

        it('Sends the correct request', function () {

            var sam = SAM({ access_token: 'fakeToken' });

            sam.upload.start({
                name: 'upload',
                size: 1024,
                mimetype: 'image/png',
                parts: 1
            });
            expect(sam.LAST_REQUEST).to.deep.equal({
                method: 'POST',
                url: '/1/upload',
                data: {
                    query: {
                        access_token: 'fakeToken'
                    },
                    body: {
                        name: 'upload',
                        size: 1024,
                        mimetype: 'image/png',
                        parts: 1
                    }
                }
            });

        });

    });

    describe('append', function () {

        it('Sends the correct request', function () {

            var sam = SAM({ access_token: 'fakeToken' });

            var buffer = new Buffer(0);
            sam.upload.append('mediaId', {
                part: 1,
                body: buffer
            });
            expect(sam.LAST_REQUEST).to.deep.equal({
                method: 'POST',
                url: '/1/upload/mediaId/append',
                data: {
                    query: {
                        access_token: 'fakeToken',
                        part: 1
                    },
                    body: buffer
                }
            });

        });

    });

    describe('complete', function () {

        it('Sends the correct request', function () {

            var sam = SAM({ access_token: 'fakeToken' });

            sam.upload.complete('mediaId');
            expect(sam.LAST_REQUEST).to.deep.equal({
                method: 'POST',
                url: '/1/upload/mediaId/complete',
                data: {
                    query: {
                        access_token: 'fakeToken'
                    },
                    body: {}
                }
            });

        });

    });

});