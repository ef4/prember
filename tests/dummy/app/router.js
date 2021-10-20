import EmberRouter from '@ember/routing/router';
import config from 'dummy/config/environment';
import { inject } from '@ember/service';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;

  // This implements is the standard instructions from ember-cli-document-title
  // for making it play nicely with ember-cli-head
  @inject()
  headData;

  setTitle(title) {
    this.headData.set('title', title);
  }
}

Router.map(function () {
  this.route('discovered');
  this.route('from-sample-data');
  this.route('use-static-asset');
  this.route('redirects');
});
