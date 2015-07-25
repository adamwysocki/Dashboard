/*jslint node: true */
"use strict";

/**
* dependencies / constants
*/
var app                     = require('./dashboard'),                           // main application
    config                  = require('config.json')('./config.json'),
    _Promise                 = require('promise'),                               // promise module
    _                       = require('lodash'),                                // lodash
    moment                  = require('moment'),                                // moment for time management
    googleViewId            = config.viewid,
    google                  = require('googleapis'),
    analytics               = google.analytics('v3');


var jwtClient = new google.auth.JWT(
                           config.analytics_email,
                           config.pem_file, //wherever you can access this file
                           null,
                           ['https://www.googleapis.com/auth/analytics.readonly'] //scope
);


/**
*  wrapper for google api functions
*/
function googleWrapper() {

    /**
    * take the array data from google analytics api
    * and format into an object for client
    */
    function formatCompareResults(metric, entries, numberOfDays) {

      var formattedResults    = [],                 // array to hold results after formatting
          returnResults       = [],                 // holder for array after split
          totalNumberOfDays   = numberOfDays * 2;   // total number of days returned from google

      // loop through return data and build an array of JSON objects
      // that have a date & value for the client graph
      for(var x = 0; x < entries.length; x++) {
        var datum     = {};
        datum.date    = moment().subtract(totalNumberOfDays - x, 'days').format('D-MMM-YY'); // format the date
        datum.value   = parseInt(entries[x][1]);                               // save the metric value
        formattedResults.push(datum);                                                        // hang on to the formatted data
      }

      // split the data into two arrays - current X days and previous X days with
      // lodash chunk
      returnResults = _.chunk(formattedResults, numberOfDays);

      // return both arrays as JSON
      return {previous: returnResults[0], current: returnResults[1]};
    }

    /**
    * get an array of stats for the provided metric
    */
    this.compare = function(metric, numberOfDays) {

      // return a Promise
      return new _Promise(function(resolve, reject) {

        // since we're comparting two periods of data with this call
        // (current & previous), extend the number of days to
        // cover both periods
        var totalNumberOfDays = numberOfDays * 2;

        jwtClient.authorize(function(err, tokens) {

            if (err) {
              console.log('[googleWrapper:compare] jwtClient.authorize error: ', err);         // log the error
              reject('[googleWrapper:compare] jwtClient.authorize error: ' + err);             // reject the promise
              return;
            }

            analytics.data.ga.get({
              auth: jwtClient,
              'ids': 'ga:' + googleViewId,
              'metrics': 'ga:' + metric,
              'start-date': moment().subtract(totalNumberOfDays, 'days').format('YYYY-MM-DD'),
              'end-date': 'yesterday',
              'dimensions': 'ga:date'
            }, function(err, response) {
              // handle the errors (if any)
              // handle the response
              if(err) {
                console.log('[googleWrapper:current] analytics.data.ga.get error: ', err);         // log the error
                reject('[googleWrapper:current] analytics.data.ga.get error: ' + err);             // reject the promise
                return;
              }

              // format the results
              var results = formatCompareResults(metric, response.rows, numberOfDays);

              // resolve the promise
              resolve(results);

            });

        }); // end of authorize

      }); // end of Promise

    }; // end of compare function
}


/**
* exports
*/
module.exports = {
  googleWrapper: googleWrapper
};
