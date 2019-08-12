import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import { inject } from '@ember/service';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,

  // This implements is the standard instructions from ember-cli-document-title
  // for making it play nicely with ember-cli-head
  headData: inject(),
  setTitle(title) {
    this.get('headData').set('title', title);
  }
});

Router.map(function() {
  this.route('discovered');
  this.route('from-sample-data');
  this.route('use-static-asset');
  this.route('redirects');
});

export default Router;
