(function() {
  var SecureView;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  SecureView = (function() {

    __extends(SecureView, OutbackView);

    function SecureView() {
      var _this = this;
      SecureView.__super__.constructor.apply(this, arguments);
      Users.bind('outback:unlock:failure', function() {
        $.mobile.pageLoading(true);
        return _this.announce('The password is not correct. Please try again or reset your password');
      });
      Users.bind('outback:unlock:success', function() {
        _this.announce('Outback is now secure');
        return _this.redirectTo('home');
      });
      this.template = _.template('<form action="#secure" method="post">\n  <p>Enter a passphrase to secure Outback. Do <strong>not</strong> use your Bridge or ESS password!</p>\n  <div data-role="fieldcontain">\n    <label for="timeout">Lock the screen if inactive for</label>\n    <select data-theme="c" name="timeout" id="timeout">\n      <option value="1">1 minute</option>\n      <option value="5" selected="selected">5 minutes</option>\n      <option value="15">15 minutes</option>\n      <option value="30">30 minutes</option>\n    </select>\n  </div>\n  <div data-role="fieldcontain">\n    <label for="passphrase">Password</label>\n    <input type="password" value="" name="passphrase" id="passphrase"/>\n  </div>\n  <div data-role="fieldcontain">\n    <label for="passphrase_confirmation">Confirm Password</label>\n    <input type="password" value="" name="passphrase_confirmation" id="passphrase_confirmation"/>\n  </div>\n  <div class="ui-grid-a">\n  <div class="ui-block-a">\n    <a data-role="button" href="#" data-theme="c" data-rel="back">Cancel</a>\n  </div>\n  <div class="ui-block-b">\n    <button data-theme="b" data-role="button" type="submit" name="submit" value="submit-value">Submit</button>\n  </div>\n  </div>\n</form>');
      this.render();
    }

    SecureView.prototype.events = {
      "submit form": "onSubmit"
    };

    SecureView.prototype.render = function() {
      this.el = this.activePage();
      this.el.find('h1').html('Outback Passphrase');
      this.el.find('.ui-content').html(this.template());
      this.reapplyStyles(this.el);
      return this.delegateEvents();
    };

    SecureView.prototype.onSubmit = function(e) {
      var passphrase;
      e.preventDefault();
      e.stopPropagation();
      $.mobile.pageLoading();
      passphrase = this.$('#passphrase').val();
      if (!passphrase.match(/\D/)) {
        return this.announce('Password required');
      } else {
        if (passphrase === !this.$('#passphrase_confirmation')) {
          this.reset();
          return this.announce('Outback passwords do not match!');
        } else {
          this.reset();
          return Users.secure(passphrase, this.$('#timeout').val());
        }
      }
    };

    SecureView.prototype.reset = function() {
      this.$('#passphrase').val('');
      return this.$('#passphrase_confirmation').val('');
    };

    return SecureView;

  })();

  this.SecureView = SecureView;

}).call(this);
