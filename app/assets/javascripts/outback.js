
  $(document).ready(function() {
    if (!Modernizr.applicationcache && !Modernizr.localstorage) {
      return $('#inadequate_browser').show();
    } else if (window.location.href.match(/#/)) {
      return window.location = '/';
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
