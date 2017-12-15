import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  headData: inject(),
  title: 'Document Title from Index Route',
  afterModel() {
    this.set('headData.description', 'OG Description from Index Route');
  }
});
