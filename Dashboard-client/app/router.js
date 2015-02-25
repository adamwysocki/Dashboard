import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route("sessions", { path: "/" });
  this.route("visitors");
  this.route("pageviews");
  this.route("dashboard");
});

export default Router;
