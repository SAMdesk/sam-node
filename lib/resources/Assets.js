'use strict';

var SAMResource = require('../SAMResource');
var samMethod = SAMResource.method;

module.exports = SAMResource.extend({

    path: 'stories/{storyId}/assets',

    create: samMethod({
        method: 'POST',
        urlParams: ['storyId']
    }),

    list: samMethod({
        method: 'GET',
        urlParams: ['storyId']
    }),

    fetch: samMethod({
        method: 'GET',
        path: '{assetId}',
        urlParams: ['storyId', 'assetId']
    })

});
