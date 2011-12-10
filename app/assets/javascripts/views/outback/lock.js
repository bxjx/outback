(function() {
  var LockView;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  LockView = (function() {

    __extends(LockView, OutbackView);

    function LockView() {
      LockView.__super__.constructor.apply(this, arguments);
      this.page = 'lock';
      this.template = _.template('<form action="#unlock" method="post">\n  <p>Lock Outback to secure your caseload data</p>\n  <div class="ui-grid-a">\n  <div class="ui-block-a">\n    <a data-role="button" href="#" data-theme="c" data-rel="back">Cancel</a>\n  </div>\n  <div class="ui-block-b">\n    <button data-theme="b" data-role="button" type="submit" name="submit" value="submit-value">Lock</button>\n  </div>\n  </div>\n</form>');
      this.render();
    }

    LockView.prototype.events = {
      "submit form": "onSubmit"
    };

    LockView.prototype.render = function() {
      this.el = this.activePage();
      this.el.find('h1').html('Lock Outback');
      this.el.find('.ui-content').html(this.template());
      this.reapplyStyles(this.el);
      return this.delegateEvents();
    };

    LockView.prototype.onSubmit = function(e) {
      e.preventDefault();
      e.stopPropagation();
      $.mobile.pageLoading();
      return Users.lock();
    };

    return LockView;

  })();

  this.LockView = LockView;

}).call(this);
