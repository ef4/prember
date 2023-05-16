'use strict';

const premberConfig = require('./lib/config');
const path = require('path');
const fs = require('fs');

module.exports = {
  name: require('./package').name,
  premberConfig,

  included(app) {
    this.fastbootOptions = fastbootOptionsFor(app.env, app.project);
  },

  postprocessTree(type, tree) {
    if (type !== 'all') {
      return tree;
    }

    return this._prerenderTree(tree);
  },

  /**
   * This function is *not* called by ember-cli directly, but supposed to be imported by an app to wrap the app's
   * tree, to add the prerendered HTML files. This workaround is currently needed for Embroider-based builds that
   * don't support the `postprocessTree('all', tree)` hook used here.
   */
  prerender(app, tree) {
    let premberAddon = app.project.addons.find(
      ({ name }) => name === 'prember'
    );

    if (!premberAddon) {
      throw new Error(
        "Could not find initialized prember addon. It must be part of your app's dependencies!"
      );
    }

    return premberAddon._prerenderTree(tree);
  },

  _prerenderTree(tree) {
    let config = this.premberConfig();
    if (!config.enabled) {
      return tree;
    }

    config.fastbootOptions = this.fastbootOptions;

    let Prerender = require('./lib/prerender');
    let BroccoliDebug = require('broccoli-debug');
    let Merge = require('broccoli-merge-trees');
    let debug = BroccoliDebug.buildDebugCallback(`prember`);
    let ui = this.project.ui;
    let plugins = loadPremberPlugins(this);

    return debug(
      new Merge(
        [
          tree,
          new Prerender(
            debug(tree, 'input'),
            config,
            ui,
            plugins,
            this._rootURL
          ),
        ],
        {
          overwrite: true,
        }
      ),
      'output'
    );
  },

  config: function (env, baseConfig) {
    this._rootURL = baseConfig.rootURL;
  },
};

function loadPremberPlugins(context) {
  let addons = context.project.addons || [];

  return addons
    .filter((addon) => addon.pkg.keywords.includes('prember-plugin'))
    .filter((addon) => {
      return (
        typeof addon.urlsForPrember === 'function' ||
        typeof addon.urlsFromPrember === 'function'
      );
    })
    .map((addon) => {
      const premberPlugin = {};

      if (addon.urlsForPrember) {
        premberPlugin.urlsForPrember = addon.urlsForPrember.bind(addon);
      }

      if (addon.urlsFromPrember) {
        premberPlugin.urlsFromPrember = addon.urlsFromPrember.bind(addon);
      }

      return premberPlugin;
    });
}

function fastbootOptionsFor(environment, project) {
  const configPath = path.join(
    path.dirname(project.configPath()),
    'fastboot.js'
  );

  if (fs.existsSync(configPath)) {
    return require(configPath)(environment);
  }
  return {};
}
