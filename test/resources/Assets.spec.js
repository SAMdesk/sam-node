'use strict';

var SAM = require('../testUtils').getSpyableSAM;
var expect = require('chai').expect;

describe('Asset Resource', function () {

    describe('create', function() {

        it('Sends the correct request', function () {

            var sam = SAM({ access_token: 'fakeToken' });

            sam.assets.create('storyId', {
                author: 'me',
                text: 'text'
            });
            expect(sam.LAST_REQUEST).to.deep.equal({
                method: 'POST',
                url: '/1/stories/storyId/assets',
                data: {
                    query: {
                        access_token: 'fakeToken'
                    },
                    body: {
                        author: 'me',
                        text: 'text'
                    }
                }
            });

        });

    });

    describe('fetch', function () {

        it('Sends the correct request', function () {

            var sam = SAM({ api_key: 'fakeKey' });

            sam.assets.fetch('storyId', 'assetId');
            expect(sam.LAST_REQUEST).to.deep.equal({
                method: 'GET',
                url: '/1/stories/storyId/assets/assetId',
                data: {
                    query: {
                        api_key: 'fakeKey'
                    }
                }
            });

        });

    });

    describe('list', function () {

        it('Sends the correct request', function () {

            var sam = SAM({ api_key: 'fakeKey' });

            sam.assets.list('storyId');
            expect(sam.LAST_REQUEST).to.deep.equal({
                method: 'GET',
                url: '/1/stories/storyId/assets',
                data: {
                    query: {
                        api_key: 'fakeKey'
                    }
                }
            });

        });

        it('Sends the correct request with query params', function () {

            var sam = SAM({ api_key: 'fakeKey' });

            sam.assets.list('storyId', {
                tags: 'tag1,tag2'
            });
            expect(sam.LAST_REQUEST).to.deep.equal({
                method: 'GET',
                url: '/1/stories/storyId/assets',
                data: {
                    query: {
                        api_key: 'fakeKey',
                        tags: 'tag1,tag2'
                    }
                }
            });

        });

    });

});