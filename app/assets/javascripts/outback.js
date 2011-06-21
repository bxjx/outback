(function() {
  $(document).ready(function() {
    return Clients.fetch({
      success: function() {
        Backbone.history.start();
        return outbackController.home();
      }
    });
  });
}).call(this);
