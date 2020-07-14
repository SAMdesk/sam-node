# SAM Node [![Build Status](https://travis-ci.org/SAMdesk/sam-node.png?branch=master)](https://travis-ci.org/SAMdesk/sam-node)

## Overview

This repo contains a node middleware to simplify the usage of the SAM API.

## Installation

`npm install sam-node`

## Documentation

Up to date API Documentation can be found [here](https://api.samdesk.io).

## API Overview

Every resource is accessed via your `sam` instance:

```js
var sam = require('sam-node')({ api_key: '{API_KEY}' });
// sam.{ RESOURCE_NAME }.{ METHOD_NAME }
```

Every resource method accepts an optional callback as the last argument:

```js
sam.stories.fetch(
    storyId,
    function(err, story) {
        //handle response
    }
);
```

Additionally, every resource method returns a promise, so you don't have to use the regular callback:

```js
sam.stories.fetch(
    storyId
).then(function(story) {
    // handle successful response
}, function(err) {
    // handle error
});
```

### Available resources & methods

*Where you see `params` it is a plain JavaScript object, e.g. `{ email: 'foo@example.com' }`*

 * account
  * `fetch()`
  * `users()`
 * assets
  * `create(storyId, params)`
  * `fetch(storyId, assetId[, params])`
  * `list(storyId[, params])`
 * stories
  * `create(params)`
  * `fetch(storyId[, params])`
  * `delete(storyId)`
  * `list([params])`
  * `fetchAsset(storyId, assetId[, params])`
  * `listAssets(storyId[, params])`
 * upload
  * `upload(params)`
  * `start(params)`
  * `append(mediaId, params)`
  * `complete(mediaId)`
 * user
  * `fetch()`

## Configuration

 * `sam.setAuth({ api_key: '{API_KEY}' });`
 * `sam.setTimeout(20000); // in ms` (default is node's default: `120000ms`)

## Author

Officially maintained by SAM.
