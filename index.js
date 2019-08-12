'use strict';

const BroccoliDebug = require('broccoli-debug');
const BroccoliMergeTrees = require('broccoli-merge-trees');

const Prerender = require('./lib/prerender');
const premberConfig = require('./lib/config');

module.exports = {
  name: 'prember',
  premberConfig,

  postprocessTree(type, tree) {
    let config = this.premberConfig();

    if (type !== 'all' || !config.enabled) {
      return tree;
    }

    let debug = BroccoliDebug.buildDebugCallback(`prember`);
    let ui = this.project.ui;
    let plugins = loadPremberPlugins(this);

    return debug(
      new BroccoliMergeTrees([
        tree,
        new Prerender(debug(tree, 'input'), this.premberConfig(), ui, plugins, this._rootURL),
      ], {
        overwrite: true
      }),
      'output'
    );
  },

  config: function(env, baseConfig) {
    this._rootURL = baseConfig.rootURL;
  }
};

function loadPremberPlugins(context) {
  let addons = context.project.addons || [];

  return addons
    .filter((addon) => addon.pkg.keywords.includes('prember-plugin'))
    .filter((addon) => typeof addon.urlsForPrember === 'function')
    .map((addon) => addon.urlsForPrember.bind(addon));
}
