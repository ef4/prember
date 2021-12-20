import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {
  @service
  headData;

  afterModel() {
    this.headData.description = 'OG Description from Index Route';
  }
}
