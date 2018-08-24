import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
  headData: inject(),
  title: 'Document Title from Index Route',
  globalVar: foo, //eslint-disable-line no-undef
  afterModel() {
    this.set('headData.description', 'OG Description from Index Route');
  }
});
