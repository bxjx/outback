(function() {
  var ResetView;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  ResetView = (function() {

    __extends(ResetView, OutbackView);

    function ResetView() {
      var _this = this;
      ResetView.__super__.constructor.apply(this, arguments);
      this.page = 'reset';
      Users.bind('outback:reset', function() {
        return _this.restart();
      });
      this.template = _.template('<form action="#reset" method="post">\n  <p>Delete any data stored on your device and reset Outback</p>\n  <div class="ui-grid-a">\n  <div class="ui-block-a">\n    <a data-role="button" href="#" data-theme="c" data-rel="back">Cancel</a>\n  </div>\n  <div class="ui-block-b">\n    <button data-theme="b" data-role="button" type="submit" name="submit" value="submit-value">Reset</button>\n  </div>\n  </div>\n</form>');
      this.render();
    }

    ResetView.prototype.events = {
      "submit form": "onSubmit"
    };

    ResetView.prototype.render = function() {
      this.el = this.activePage();
      this.el.find('h1').html('Reset Outback');
      this.el.find('.ui-content').html(this.template());
      this.reapplyStyles(this.el);
      return this.delegateEvents();
    };

    ResetView.prototype.onSubmit = function(e) {
      e.preventDefault();
      e.stopPropagation();
      $.mobile.pageLoading();
      return Users.erase();
    };

    return ResetView;

  })();

  this.ResetView = ResetView;

}).call(this);
