import Dashboard from '../routes/dashboard';

export default Dashboard.extend({
  renderTemplate: function() {
    // render a default template for this route
    this.render('default');
  },
  model : function() {
    return this.getModel('users');
  }
});
