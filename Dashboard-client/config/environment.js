/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'dashboard-client',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      API_HOST: 'http://localhost:9090'
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';

    ENV.APP.API_HOST = 'http://localhost:9090';
  }

  if (environment === 'production') {

  }


  ENV.contentSecurityPolicy = {
    'default-src': "'none'",
    // Allow scripts
    'script-src': "'self' 'unsafe-eval'",
    'font-src': "'self'", // Allow fonts
    'connect-src': "'self' http://localhost:9090", // Allow data (ajax/websocket)
    'img-src': "'self'",
    // Allow inline styles and loaded CSS
    'style-src': "'self' 'unsafe-inline'"
  };

  return ENV;
};
