'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const urls = require('./node-tests/url-tester');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {

    // This is the configuration for Prember's dummy app that we use
    // to test prember. You would do something similar to this in your
    // own app's ember-cli-build.js to configure prember, see the
    // README.
    prember: {
      enabled: true,
      urls
    }
  });

  return app.toTree();
};
