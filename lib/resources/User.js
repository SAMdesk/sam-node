'use strict';

var SAMResource = require('../SAMResource');
var samMethod = SAMResource.method;

module.exports = SAMResource.extend({

    path: 'user',

    fetch: samMethod({
        method: 'GET'
    })

});
