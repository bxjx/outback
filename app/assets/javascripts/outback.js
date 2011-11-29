
  $(document).ready(function() {
    if (window.location.href.match(/#/)) {
      return window.location = window.location.href.replace(/#.*/, '');
    } else {
      $.mobile.pageLoading();
      $(window.applicationCache).bind('updateready', function() {
        window.applicationCache.swapCache();
        return window.location.reload();
      });
      return $(window.applicationCache).bind('cached noupdate error obsolete', function() {
        $.mobile.pageLoading(true);
        Backbone.history.start();
        return outbackController.home();
      });
    }
  });
