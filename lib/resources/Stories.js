'use strict';

var SAMResource = require('../SAMResource');
var samMethod = SAMResource.method;

module.exports = SAMResource.extend({

    path: 'stories',

    includeBasic: [
        'list', 'create', 'fetch', 'delete'
    ],

    listAssets: samMethod({
        method: 'GET',
        path: '/{storyId}/assets',
        urlParams: ['storyId']
    }),

    createAsset: samMethod({
        method: 'POST',
        path: '/{storyId}/assets',
        urlParams: ['storyId']
    }),

    fetchAsset: samMethod({
        method: 'GET',
        path: '/{storyId}/assets/{assetId}',
        urlParams: ['storyId', 'assetId']
    })

});
