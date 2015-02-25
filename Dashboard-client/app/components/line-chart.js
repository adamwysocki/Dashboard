import Ember from 'ember';

// component for display line graph for current and previous data sets
export default Ember.Component.extend({
  didInsertElement : function() {
    // wait until the component loads and then process the data
    Ember.run.scheduleOnce('afterRender', this, 'updateGraph');
  },
  // update the graph with the data from the model
  // in the future we could observe 'current' and 'previous' to update
  // dynamically, but keeping it simple for now.
  updateGraph: function() {

    // setup variables

    // get the chart data
    var currentData       = this.get('current'),    // current for last n days
        previousData      = this.get('previous');   // previous for n days prior to current

    // get the graph from the dom and set the dimensions so that
    // the x & y axis can be calculated
    //
    // currently height & width are fixed and the graph isn't visible
    // on mobile browsers, in the future we can adjust the size
    // dynamically based on window dimensions
    //
    var graph             = d3.select("#graph"),
        WIDTH             = 900,  // make dynamic in future
        HEIGHT            = 250,  // make dynamic in future
        MARGINS           = { top: 20, right: 20, bottom: 20, left: 50 },

        // determine the current data range for the x-axis (date)
        currentXRange     = d3.time.scale()
                            .range([MARGINS.left, WIDTH - MARGINS.right])
                            .domain(d3.extent(currentData, function(d) { return d.date; })),

        // determine the current data range for the y axis (number)
        currentYRange     = d3.scale.linear()
                            .range([HEIGHT - MARGINS.top, MARGINS.bottom])
                            .domain([0, d3.max(currentData, function (d) { return d.value; }) ]),

        // determine the previous data range for the x axis
        // NOTE: commented out because we actually don't need this because the x axis is the dates from the current data,
        // and the previous data is the exact same number of days. if that changes, adjust
        /*previousXRange    = d3.time.scale()
                            .range([MARGINS.left, WIDTH - MARGINS.right])
                            .domain(d3.extent(previousData, function(d) { return d.date; })),*/

        // determine the previous data range for the y axis
        previousYRange    = d3.scale.linear()
                            .range([HEIGHT - MARGINS.top, MARGINS.bottom])
                            .domain([0, d3.max(previousData, function (d) { return d.value; }) ]),

        // format the x axis (dates)
        xAxis             = d3.svg.axis()
                            .scale(currentXRange)
                            .ticks(5)
                            .tickFormat(d3.time.format("%b %d")),

        // format the y axis (values)
        yAxis             = d3.svg.axis()
                            .scale(currentYRange)
                            .tickSize(2)
                            .orient("left")
                            .ticks(4),

        // function to format the data point by point in the graph for 'current' data
        currentLineFunc   = d3.svg.line()
                            .x(function (d) { return currentXRange(d.date); })
                            .y(function (d) { return currentYRange(d.value); })
                            .interpolate('linear'),

        // function to format the data point by point in the graph for 'pevious' data
        previousLineFunc  = d3.svg.line()
                            .x(function (d) { return currentXRange(d.date); })
                            .y(function (d) { return previousYRange(d.value); })
                            .interpolate('linear');


    // functions for formatting the graph

    // add the x axis to the graph
    graph.append("svg:g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
          .call(xAxis);

    // add the y axis to the graph
    graph.append("svg:g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + (MARGINS.left) + ",0)")
          .call(yAxis);

    // add the line for the current data to the graph
    graph.append("svg:path")
          .attr("d", currentLineFunc(currentData))
          .attr("stroke", "blue")
          .attr("stroke-width", 4)
          .attr("fill", "none");

    // add the line for the previous data to the graph
    graph.append("svg:path")
          .attr("d", previousLineFunc(previousData))
          .attr("stroke", "orange")
          .attr("stroke-width", 4)
          .attr("fill", "none");
  }
});
