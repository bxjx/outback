(function() {
  var UnlockView;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  UnlockView = (function() {

    __extends(UnlockView, OutbackView);

    function UnlockView() {
      var _this = this;
      UnlockView.__super__.constructor.apply(this, arguments);
      this.page = 'unlock';
      Users.bind('outback:unlock:success', function() {
        _this.announce('Unlocked');
        return _this.redirectTo('home');
      });
      Users.bind('outback:unlock:failure', function() {
        return _this.announce('Unlock failed. Please try again.');
      });
      this.template = _.template('<form action="#unlock" method="post">\n  <p>Enter your Outback password:</p>\n  <div data-role="fieldcontain">\n    <label for="passphrase">Password</label>\n    <input type="password" value="" name="passphrase" id="passphrase"/>\n  </div>\n  <div data-role="fieldcontain">\n    <label for="timeout">Lock the screen if inactive for</label>\n    <select data-theme="c" name="timeout" id="timeout">\n      <option value="1">1 minute</option>\n      <option value="5" selected="selected">5 minutes</option>\n      <option value="15">15 minutes</option>\n      <option value="30">30 minutes</option>\n    </select>\n  </div>\n  <div class="ui-grid-a">\n  <div class="ui-block-a">\n    <a data-role="button" href="#" data-theme="c" data-rel="back">Cancel</a>\n  </div>\n  <div class="ui-block-b">\n    <button data-theme="b" data-role="button" type="submit" name="submit" value="submit-value">Submit</button>\n  </div>\n  </div>\n</form>');
      this.render();
    }

    UnlockView.prototype.events = {
      "submit form": "onSubmit"
    };

    UnlockView.prototype.render = function() {
      this.el = this.activePage();
      this.el.find('h1').html('Unlock Outback');
      this.el.find('.ui-content').html(this.template());
      this.reapplyStyles(this.el);
      this.delegateEvents();
      return this.reset();
    };

    UnlockView.prototype.onSubmit = function(e) {
      var passphrase;
      e.preventDefault();
      e.stopPropagation();
      $.mobile.pageLoading();
      passphrase = this.$('#passphrase').val();
      if (!passphrase.match(/\D/)) {
        return this.announce('Password required');
      } else {
        return Users.unlock(passphrase, $('#timeout').val());
      }
    };

    UnlockView.prototype.reset = function() {
      return this.$('#passphrase').val('');
    };

    return UnlockView;

  })();

  this.UnlockView = UnlockView;

}).call(this);
