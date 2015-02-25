/*jslint node: true */
"use strict";

/**
* dependencies / constants
*/
var app                     = require('./dashboard'),                           // main application
    config                  = require('config.json')('./config.json'),
    _Promise                 = require('promise'),                               // promise module
    GA                      = require('googleanalytics'),                       // google analytics API module
    _                       = require('lodash'),                                // lodash
    gaConfig                = {
                                "user": config.user,
                                "password": config.password
                              },
    moment                  = require('moment'),                                // moment for time management
    googleId                = config.id,                                        // google analytics id
    ga                      = new GA.GA(gaConfig);                              // setup google analytics api


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
        for(var y = 0; y < entries[x].metrics.length; y++) {
          var datum     = {};
          datum.date    = moment().subtract(totalNumberOfDays - x, 'days').format('D-MMM-YY'); // format the date
          datum.value   = entries[x].metrics[y]["ga:" + metric];                               // save the metric value
          formattedResults.push(datum);                                                        // hang on to the formatted data
        }
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

        // call google login
        ga.login(function(err, token) {

          if(err) {
            console.log('[googleWrapper:compare] ga.login error: ', err);         // log the error
            reject('[googleWrapper:compare] ga.login error: ' + err);             // reject the promise
            return;
          }

          // setup options for the 'get'
          var options = {
            'ids':          'ga:' + googleId,
            'dimensions':   'ga:date',
            'start-date':   moment().subtract(totalNumberOfDays, 'days').format('YYYY-MM-DD'),
            'end-date':     'yesterday',
            'metrics':      'ga:' + metric,
          };

          // call the 'get'
          ga.get(options, function(err, entries) {

            // check for error
            if(err) {
              console.log('[googleWrapper:current] ga.get error: ', err);         // log the error
              reject('[googleWrapper:current] ga.get error: ' + err);             // reject the promise
              return;
            }

            // format the results
            var results = formatCompareResults(metric, entries, numberOfDays);

            // resolve the promise
            resolve(results);

          }); // end of get

        }); // end of login

      }); // end of Promise

    }; // end of compare function
}


/**
* exports
*/
module.exports = {
  googleWrapper: googleWrapper
};
