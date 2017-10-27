/* eslint-env node */
'use strict';

const Prerender = require('./lib/prerender');
const BroccoliDebug = require('broccoli-debug');
const Merge = require('broccoli-merge-trees');
const debug = BroccoliDebug.buildDebugCallback(`prember`);

module.exports = {
  name: 'prember',
  isDevelopingAddon() { return true; },

  serverMiddleware({ app }) {
    app.use((req, res, next) => {
      console.log('my middleware', req.url, req.serveUrl);
      next();
    });
  },

  postprocessTree(type, tree) {
    if (type !== 'all') {
      return tree;
    }

    let options = {
      urls: [
        '/',
        '/vision/chapter-1'
      ]
    };

    return debug(
      new Merge([
        tree,
        new Prerender(debug(tree, 'input'), options),
      ], {
        overwrite: true
      }),
      'output'
    );
  }
};
