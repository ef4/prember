import Route from '@ember/routing/route';

export default class RedirectsRoute extends Route {
  beforeModel() {
    this.transitionTo('from-sample-data');
  }
}
