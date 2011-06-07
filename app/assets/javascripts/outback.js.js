(function() {
  var Client, ClientCollection, HomeView, LoginView, OutbackController, OutbackView, SyncView, User, UserCollection;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  User = (function() {
    __extends(User, Backbone.Model);
    function User() {
      User.__super__.constructor.apply(this, arguments);
    }
    User.prototype.authenticated = false;
    return User;
  })();
  UserCollection = (function() {
    __extends(UserCollection, Backbone.Collection);
    function UserCollection() {
      UserCollection.__super__.constructor.apply(this, arguments);
    }
    UserCollection.prototype.model = User;
    UserCollection.prototype.currentUser = false;
    UserCollection.prototype.authenticate = function(login, password) {
      return $.ajax('/api/v1/users/auth.json', {
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: {
          login: login,
          password: password
        },
        success: __bind(function(data) {
          this.currentUser = new User(data);
          return this.trigger('auth:authenticated', this.currentUser);
        }, this),
        error: __bind(function(jqXHR, textStatus) {
          switch (jqXHR.status) {
            case 401:
              return this.trigger('auth:unauthorised');
            case 408:
              return this.trigger('auth:timeout');
            case 500:
              return this.trigger('auth:error:bridge');
            default:
              return this.trigger('auth:error');
          }
        }, this)
      });
    };
    return UserCollection;
  })();
  this.Users = new UserCollection;
  Client = (function() {
    __extends(Client, Backbone.Model);
    function Client() {
      Client.__super__.constructor.apply(this, arguments);
    }
    Client.prototype.sync = Backbone.localSync;
    return Client;
  })();
  ClientCollection = (function() {
    __extends(ClientCollection, Backbone.Collection);
    function ClientCollection() {
      ClientCollection.__super__.constructor.apply(this, arguments);
    }
    ClientCollection.prototype.localStorage = new Store("clients");
    ClientCollection.prototype.sync = Backbone.localSync;
    ClientCollection.prototype.url = function() {
      return '/api/v1/clients/caseload?token=0d2acb7d-d4f6-4dbb-bf6e-6ebac7fa5a21';
    };
    ClientCollection.prototype.model = Client;
    ClientCollection.prototype.bridgeSync = function(token, options) {
      var callbacks;
      if (options == null) {
        options = {};
      }
      this.sync = Backbone.sync;
      callbacks = {
        success: __bind(function() {
          var chainedSaves, models;
          models = this.models;
          this.sync = Backbone.localSync;
          chainedSaves = this.map(function(model) {
            return function(callback) {
              var save_callbacks;
              save_callbacks = {
                success: function() {
                  return callback(null, model.id);
                },
                error: function(error) {
                  return callback(error);
                }
              };
              return model.save(null, save_callbacks);
            };
          });
          return async.parallel(chainedSaves, function() {});
        }, this),
        error: __bind(function() {
          return this.sync = Backbone.localSync;
        }, this)
      };
      return this.fetch(callbacks);
    };
    return ClientCollection;
  })();
  this.Clients = new ClientCollection;
  OutbackView = (function() {
    __extends(OutbackView, Backbone.View);
    function OutbackView() {
      OutbackView.__super__.constructor.apply(this, arguments);
    }
    OutbackView.prototype.activePage = function() {
      return $(".ui-page-active");
    };
    OutbackView.prototype.reapplyStyles = function(el) {
      el.find('ul[data-role]').listview();
      el.find('div[data-role="fieldcontain"]').fieldcontain();
      el.find('button[data-role="button"]').button();
      el.find('input,textarea').textinput();
      return el.page();
    };
    OutbackView.prototype.redirectTo = function(page) {
      return $.mobile.changePage(page);
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
    return OutbackView;
  })();
  SyncView = (function() {
    __extends(SyncView, OutbackView);
    function SyncView() {
      this.render = __bind(this.render, this);      SyncView.__super__.constructor.apply(this, arguments);
      this.el = this.activePage();
      this.template = _.template('Welcome <%=Users.currentUser.get(\'name\')%>');
      this.render();
    }
    SyncView.prototype.render = function() {
      this.el.find('h1').html('Sync with Bridge');
      this.el.find('.ui-content').html(this.template());
      return this.reapplyStyles(this.el);
    };
    return SyncView;
  })();
  LoginView = (function() {
    __extends(LoginView, OutbackView);
    function LoginView() {
      LoginView.__super__.constructor.apply(this, arguments);
      this.el = this.activePage();
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
      Users.bind('auth:authenticated', __bind(function(user) {
        return this.redirectTo('sync');
      }, this));
      this.template = _.template('<form action="#login" method="post">\n  <div data-role="fieldcontain">\n    <label for="login">Login</label>\n    <input type="text" value="" name="login" id="login"/>\n  </div>\n  <div data-role="fieldcontain">\n    <label for="password">Password</label>\n    <input type="password" value="" name="password" id="password"/>\n  </div>\n  <button data-role="button" type="submit" data-theme="b" name="submit" value="submit-value">Submit</button>\n</form>');
      this.render();
    }
    LoginView.prototype.events = {
      "submit form": "onSubmit"
    };
    LoginView.prototype.render = function() {
      this.el.find('h1').html('Login');
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
  HomeView = (function() {
    __extends(HomeView, OutbackView);
    function HomeView() {
      this.render = __bind(this.render, this);      HomeView.__super__.constructor.apply(this, arguments);
      this.el = this.activePage();
      this.template = _.template('<ul data-role="listview" data-inset="true" data-theme="c" data-dividertheme="b">\n  <li data-role="list-divider">Caseload</li>\n  <li><a href="#caseload">Caseload</a></li>\n  <li data-role="list-divider">Account and Sync</li> <li><a href="#sync">Sync with Bridge</a></li>\n  <li><a href="#login">Login</a></li>\n</ul>');
      this.render();
    }
    HomeView.prototype.render = function() {
      this.el.find('.ui-content').html(this.template());
      return this.reapplyStyles(this.el);
    };
    return HomeView;
  })();
  OutbackController = (function() {
    __extends(OutbackController, Backbone.Controller);
    OutbackController.prototype.routes = {
      "home": "home",
      "sync": "sync",
      "login": "login"
    };
    function OutbackController() {
      OutbackController.__super__.constructor.apply(this, arguments);
      this._views = {};
    }
    OutbackController.prototype.home = function() {
      var _base;
      return (_base = this._views)['home'] || (_base['home'] = new HomeView);
    };
    OutbackController.prototype.sync = function() {
      var _base;
      return (_base = this._views)['sync'] || (_base['sync'] = new SyncView);
    };
    OutbackController.prototype.login = function() {
      var _base;
      return (_base = this._views)['login'] || (_base['login'] = new LoginView);
    };
    return OutbackController;
  })();
  $(document).ready(function() {
    var outbackController;
    outbackController = new OutbackController;
    return outbackController.home();
  });
}).call(this);
