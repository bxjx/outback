(function() {
  var OutbackView;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  OutbackView = (function() {

    __extends(OutbackView, Backbone.View);

    function OutbackView() {
      var _this = this;
      Users.bind('outback:lock:success', function() {
        _this.announce("Locking");
        return _this.restart();
      });
    }

    OutbackView.prototype.logActivity = function() {
      return Users.logActivity();
    };

    OutbackView.prototype.activePage = function() {
      return $("#" + this.page);
    };

    OutbackView.prototype.reapplyStyles = function(el) {
      el.find('ul[data-role]').listview();
      el.find('div[data-role="fieldcontain"]').fieldcontain();
      el.find('button[data-role="button"],a[data-role="button"]').button();
      el.find('input,textarea').textinput();
      el.find('div[data-role="collapsible"]').collapsible();
      el.find('select').selectmenu();
      return el.page();
    };

    OutbackView.prototype.redirectTo = function(page) {
      if (page === 'home') {
        return $.mobile.changePage(page, null, 'reverse');
      } else {
        return $.mobile.changePage(page);
      }
    };

    OutbackView.prototype.announce = function(message) {
      $.mobile.pageLoading(true);
      return $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h1>" + message + "</h1></div>").css({
        "display": "block",
        "opacity": 0.96,
        "top": $(window).scrollTop() + 100
      }).appendTo($.mobile.pageContainer).delay(800).fadeOut(400, function() {
        return this.remove;
      });
    };

    OutbackView.prototype.isoDate = function(d) {
      var pad;
      pad = function(n) {
        if (n < 10) {
          return "0" + n;
        } else {
          return n;
        }
      };
      return "" + (d.getUTCFullYear()) + "-" + (pad(d.getUTCMonth() + 1)) + "-" + (pad(d.getUTCDate())) + "T" + (pad(d.getUTCHours())) + ":" + (pad(d.getUTCMinutes())) + ":" + (pad(d.getUTCSeconds())) + "Z";
    };

    OutbackView.prototype.restart = function() {
      $('.ui-page').remove();
      return window.location = '/';
    };

    return OutbackView;

  })();

  this.OutbackView = OutbackView;

}).call(this);
