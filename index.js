/* eslint-env node */
'use strict';

const Prerender = require('./lib/prerender');
const BroccoliDebug = require('broccoli-debug');
const Merge = require('broccoli-merge-trees');
const debug = BroccoliDebug.buildDebugCallback(`prember`);
const premberConfig = require('./lib/config');

module.exports = {
  name: 'prember',

  premberConfig,

  postprocessTree(type, tree) {
    let config = this.premberConfig();
    if (type !== 'all' || !config.enabled) {
      return tree;
    }

    return debug(
      new Merge([
        tree,
        new Prerender(debug(tree, 'input'), this.premberConfig()),
      ], {
        overwrite: true
      }),
      'output'
    );
  }
};
