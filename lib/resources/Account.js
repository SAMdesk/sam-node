'use strict';

var SAMResource = require('../SAMResource');
var samMethod = SAMResource.method;

module.exports = SAMResource.extend({

    path: 'account',

    fetch: samMethod({
        method: 'GET'
    }),

    users: samMethod({
        method: 'GET',
        path: '/users'
    })

});
