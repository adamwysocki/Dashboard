import Ember from 'ember';

// simple helper to display 4 digit numbers with a comma
export function formatNumber(input) {
  return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default Ember.Handlebars.makeBoundHelper(formatNumber);
