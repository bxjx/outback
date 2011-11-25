
  $(document).ready(function() {
    if (window.location.href.match(/#/)) {
      return window.location = window.location.href.replace(/#.*/, '');
    } else {
      return Clients.fetch({
        success: function() {
          Backbone.history.start();
          return outbackController.home();
        }
      });
    }
  });
