(function() {
  var LoginView;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  LoginView = (function() {
    __extends(LoginView, OutbackView);
    function LoginView() {
      LoginView.__super__.constructor.apply(this, arguments);
      Users.bind('auth:unauthorised', __bind(function() {
        $('#password').val('');
        return this.announce('Authentication failed. Please try again');
      }, this));
      Users.bind('auth:timeout', __bind(function() {
        return this.announce('Network timeout. Possibly wait until your connecton is better');
      }, this));
      Users.bind('auth:error:bridge', __bind(function() {
        return this.announce('Error! This has been logged and will be investigated');
      }, this));
      Users.bind('auth:error', __bind(function() {
        return this.announce('Error. Please try again later');
      }, this));
      this.template = _.template('<form action="#login" method="post">\n  <div data-role="fieldcontain">\n    <label for="login">Login (e.g. EX2003)</label>\n    <input type="text" value="" name="login" id="login"/>\n  </div>\n  <div data-role="fieldcontain">\n    <label for="password">Password</label>\n    <input type="password" value="" name="password" id="password"/>\n  </div>\n  <div class="ui-grid-a">\n  <div class="ui-block-a">\n    <a data-role="button" href="#" data-theme="c" data-rel="back">Cancel</a>\n  </div>\n  <div class="ui-block-b">\n    <button data-theme="b" data-role="button" type="submit" name="submit" value="submit-value">Submit</button>\n  </div>\n  </div>\n</form>');
      this.render();
    }
    LoginView.prototype.events = {
      "submit form": "onSubmit"
    };
    LoginView.prototype.render = function() {
      this.el = this.activePage();
      this.el.find('h1').html('Bridge Login');
      this.el.find('.ui-content').html(this.template());
      this.reapplyStyles(this.el);
      return this.delegateEvents();
    };
    LoginView.prototype.onSubmit = function(e) {
      $.mobile.pageLoading();
      Users.authenticate(this.$("input[name='login']").val(), this.$("input[name='password']").val());
      e.preventDefault();
      return e.stopPropagation();
    };
    return LoginView;
  })();
  this.LoginView = LoginView;
}).call(this);
