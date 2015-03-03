/*jslint node: true */
"use strict";

/**
* Dashboard Server
*/

/**
* Variables and constants
*/
var util              = require('util'),
    config            = require('config.json')('./config.json'),
    express           = require('express'),
    DEFAULT_NUM_DAYS  = config.default_num_days || 30,
    port              = process.env.PORT || 9090;

var gWrapper          = require('./googleWrapper');

/**
* Create application
*/
var app               = express(),
    server            = require('http').createServer(app),
    env               = process.env.NODE_ENV || 'development';

/**
* Setup dev environment related items
*/
if ( ('development' == env) || ('testing' == env) ){
  // configure stuff here
  app.set('mode', 'development');
} else {
  app.set('mode', 'production');
}

/**
* Create an instance of the google API wrapper
*/
var gw = new gWrapper.googleWrapper();

/**
* Allow local instance testing in firefox & opera from ember server
*/
app.use(function (req, res, next) {

  if(app.get('mode') === 'development') {

    res.header("Access-Control-Allow-Origin", "http://localhost:4200");

  }

  next();

});

/**
* pageviews route
*/
app.get('/api/1/pageviews', function(request, response) {

  getGoogleData('pageviews', DEFAULT_NUM_DAYS, response);

});

/**
* sessions route
*/
app.get('/api/1/sessions', function(request, response) {

  getGoogleData('sessions', DEFAULT_NUM_DAYS, response);

});

/**
* users route
*/
app.get('/api/1/users', function(request, response) {

  getGoogleData('users', DEFAULT_NUM_DAYS, response);

});

/**
* common function for google wrapper calls ... the google wrapper returns
* promises, so this function handles the failed promise or could be used in the future
* to do additional calculations on the returned data or even combine data
* from multiple sources into a single api call
*/
function getGoogleData(type, numDays, response) {

  gw.compare(type, numDays).then(function(data) {

    response.json( {success: true, current: data.current, previous: data.previous, msg: 'success'} );

  }).catch(function(err) {

    response.json( {success: false, current: -1, msg: 'failed - ' + err} );

  });

}


/**
* start the http server.
*/
server.listen(port, function () {
  console.log('Dashboard Server [' + app.get('mode') + '] started on port %d', server.address().port);
});
