import Ember from 'ember';

// simple helper to display a decimal as a percentage
export function formatPercentage(input) {
  if(input > 0) {
    return '+' + (input * 100).toFixed(2) + '%';
  } else {
    return (input * 100).toFixed(2) + '%';
  }
}

export default Ember.Handlebars.makeBoundHelper(formatPercentage);
