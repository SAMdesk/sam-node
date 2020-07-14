'use strict';

var samMethod = require('./SAMMethod');

module.exports = {

    create: samMethod({
        method: 'POST'
    }),

    list: samMethod({
        method: 'GET'
    }),

    fetch: samMethod({
        method: 'GET',
        path: '/{id}',
        urlParams: ['id']
    }),

    update: samMethod({
        method: 'POST',
        path: '{id}',
        urlParams: ['id']
    }),

    // Avoid 'delete' keyword in JS
    delete: samMethod({
        method: 'DELETE',
        path: '{id}',
        urlParams: ['id']
    })

};