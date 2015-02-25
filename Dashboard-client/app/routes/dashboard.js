import Ember from 'ember';
import ENV from "dashboard-client/config/environment"; // import ENV

export default Ember.Route.extend({
  getModel: function(endpoint) {
    // return a promise
    return new Ember.RSVP.Promise(function(resolve, reject) {

      // setup variables
      var url       = ENV.APP.API_HOST  + "/" + endpoint,     // API url
      parseDate     = d3.time.format("%d-%b-%y").parse, // turns returned dates into D3 date format
      currentCount  = 0,                                // totals
      previousCount = 0,
      difference    = 0;

      // make the GET request
      Ember.$.get( url, function( data ) {

        // if the API call was successful
        if(data.success === true) {

          // loop through the results, format dates for D3, and add up totals
          for(var x = 0; x < data.current.length; x++) {
            // the only date we use is the current data (default 30 days) in the x axis
            // so we only have to parse the date once for both data sets
            data.current[x].date  =   data.previous[x].date = parseDate(data.current[x].date);
            currentCount          +=  data.current[x].value;
            previousCount         +=  data.previous[x].value;
          }

          // calculate the delta between the two time periods
          difference = (currentCount - previousCount) / previousCount;

          // resolve the promoise and return the model
          resolve({'current': data.current, 'previous': data.previous, 'currentCount': currentCount, 'previousCount': previousCount, 'difference': difference});

        } else {

          // API call failed, return an error
          reject('server error');

        }

      });
    });
  }
});
