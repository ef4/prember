/* eslint-env node */
'use strict';

const premberConfig = require('./lib/config');

module.exports = {
  name: 'prember',
  premberConfig,

  postprocessTree(type, tree) {
    let config = this.premberConfig();
    if (type !== 'all' || !config.enabled) {
      return tree;
    }

    let Prerender = require('./lib/prerender');
    let BroccoliDebug = require('broccoli-debug');
    let Merge = require('broccoli-merge-trees');
    let debug = BroccoliDebug.buildDebugCallback(`prember`);
    let ui = this.project.ui;
    return debug(
      new Merge([
        tree,
        new Prerender(debug(tree, 'input'), this.premberConfig(), ui),
      ], {
        overwrite: true
      }),
      'output'
    );
  }
};
