'use strict';

var SAM = require('../testUtils').getSpyableSAM;
var expect = require('chai').expect;

describe('Story Resource', function () {

    describe('create', function() {

        it('Sends the correct request', function () {

            var sam = SAM({ access_token: 'fakeToken' });

            sam.stories.create({
                name: 'story'
            });
            expect(sam.LAST_REQUEST).to.deep.equal({
                method: 'POST',
                url: '/1/stories',
                data: {
                    query: {
                        access_token: 'fakeToken'
                    },
                    body: {
                        name: 'story'
                    }
                }
            });

        });

    });

    describe('fetch', function () {

        it('Sends the correct request', function () {

            var sam = SAM({ api_key: 'fakeKey' });

            sam.stories.fetch('storyId');
            expect(sam.LAST_REQUEST).to.deep.equal({
                method: 'GET',
                url: '/1/stories/storyId',
                data: {
                    query: {
                        api_key: 'fakeKey'
                    }
                }
            });

        });

        it('Sends the correct request with query params', function () {

            var sam = SAM({ api_key: 'fakeKey' });

            sam.stories.fetch('storyId', {
                tags: 'tag1,tag2'
            });
            expect(sam.LAST_REQUEST).to.deep.equal({
                method: 'GET',
                url: '/1/stories/storyId',
                data: {
                    query: {
                        api_key: 'fakeKey',
                        tags: 'tag1,tag2'
                    }
                }
            });

        });

    });

    describe('list', function () {

        it('Sends the correct request', function () {

            var sam = SAM({ api_key: 'fakeKey' });

            sam.stories.list();
            expect(sam.LAST_REQUEST).to.deep.equal({
                method: 'GET',
                url: '/1/stories',
                data: {
                    query: {
                        api_key: 'fakeKey'
                    }
                }
            });

        });

        it('Sends the correct request with query params', function () {

            var sam = SAM({ api_key: 'fakeKey' });

            sam.stories.list({
                tags: 'tag1,tag2',
                all: true
            });
            expect(sam.LAST_REQUEST).to.deep.equal({
                method: 'GET',
                url: '/1/stories',
                data: {
                    query: {
                        api_key: 'fakeKey',
                        tags: 'tag1,tag2',
                        all: true
                    }
                }
            });

        });

    });

    describe('delete', function () {

        it('Sends the correct request', function () {

            var sam = SAM({ api_key: 'fakeKey' });

            sam.stories.delete('storyId');
            expect(sam.LAST_REQUEST).to.deep.equal({
                method: 'DELETE',
                url: '/1/stories/storyId',
                data: {
                    query: {
                        api_key: 'fakeKey'
                    }
                }
            });

        });

    });

    describe('createAsset', function() {

        it('Sends the correct request', function () {

            var sam = SAM({ access_token: 'fakeToken' });

            sam.stories.createAsset('storyId', {
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

    describe('fetchAsset', function () {

        it('Sends the correct request', function () {

            var sam = SAM({ api_key: 'fakeKey' });

            sam.stories.fetchAsset('storyId', 'assetId');
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

    describe('listAssets', function () {

        it('Sends the correct request', function () {

            var sam = SAM({ api_key: 'fakeKey' });

            sam.stories.listAssets('storyId');
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

            sam.stories.listAssets('storyId', {
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