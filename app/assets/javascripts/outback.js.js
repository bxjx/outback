(function() {
  var CaseloadView, Client, ClientCollection, ClientView, HomeView, LoginView, OutbackController, OutbackView, PinView, SyncView, User, UserCollection;
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
    User.prototype.syncing = false;
    User.prototype.lastSync = null;
    User.prototype.lastSyncStatus = null;
    User.prototype.startSync = function() {
      console.log("starting sync");
      this.syncing = true;
      return Clients.bridgeSync();
    };
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
          this.currentUser.authenticated = true;
          this.currentUser.startSync();
          console.log("about to trigger ==== " + Users.currentUser.syncing);
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
      return '/api/v1/clients/caseload.json?token=' + Users.currentUser.get('token');
    };
    ClientCollection.prototype.model = Client;
    ClientCollection.prototype.bridgeSync = function() {
      var callbacks;
      Users.currentUser.lastSyncStarted = new Date();
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
          return async.parallel(chainedSaves, __bind(function() {
            Users.currentUser.syncing = false;
            Users.currentUser.lastSync = new Date();
            Users.currentUser.lastSyncStatus = 'success';
            console.info("triggered sync");
            return this.trigger('clients:synced');
          }, this));
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
      el.find('button[data-role="button"],a[data-role="button"]').button();
      el.find('input,textarea').textinput();
      el.find('div[data-role="collapsible"]').collapsible();
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
    return OutbackView;
  })();
  SyncView = (function() {
    __extends(SyncView, OutbackView);
    function SyncView() {
      this.render = __bind(this.render, this);      SyncView.__super__.constructor.apply(this, arguments);
      this.template = _.template('<% if (Users.currentUser && Users.currentUser.syncing){ %>\n<a data-role="button" data-theme="b" id="#cancel">Cancel Sync</a>\n<% }else{ %>\n<a href="#login" data-rel="dialog" data-transition="flip" data-role="button" data-icon="refresh">Sync with Bridge</a>\n<% }%>\n\n<% if (Users.currentUser && Users.currentUser.lastSyncStarted){ %>\n  <ul id="sync-status" data-role="listview">\n    <li id="sync_step_authenticate">Authenticate with Bridge <span id="error-info"></span><span class="ui-icon status complete"></status></li>\n    <li id="sync_step_caseload">Sync Caseload<span class="ui-icon status <%= Users.currentUser.lastSync ? \'complete\' : \'loading\'%>"></status></li>\n    <% if (Users.currentUser && Users.currentUser.lastSyncStatus){ %>\n    <li>Last sync successfully completed <abbrev class="timeago" title="<%=this.isoDate(Users.currentUser.lastSync)%>"></abbrev</li>\n    <% } %>\n  </ul>\n<% } %>');
      Users.bind('auth:authenticated', __bind(function(user) {
        $('.ui-dialog').dialog('close');
        return this.render();
      }, this));
      Clients.bind('clients:synced', __bind(function() {
        this.render();
        return this.announce("Sync successfull completed");
      }, this));
      Users.bind('auth:unauthorised', __bind(function() {
        return this.authStepFailed('unauthorised');
      }, this));
      Users.bind('auth:timeout', __bind(function() {
        return this.authStepFailed('timeout');
      }, this));
      Users.bind('auth:error:bridge', __bind(function() {
        return this.authStepFailed('server error');
      }, this));
      Users.bind('auth:error', __bind(function() {
        return this.authStepFailed('error');
      }, this));
      this.render();
    }
    SyncView.prototype.authStepFailed = function(message) {
      $('#sync_step_authenticate').removeClass('complete').addClass('failed');
      return $('#sync_step_authenticate #error-info').text("Error: " + message);
    };
    SyncView.prototype.render = function() {
      this.el = $('#sync');
      this.el.find('h1').html('Sync with Bridge');
      this.el.find('.ui-content').html(this.template());
      $("abbrev.timeago").timeago();
      return this.reapplyStyles(this.el);
    };
    return SyncView;
  })();
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
      console.info("adding content");
      this.reapplyStyles(this.el);
      console.info("applying");
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
      this.template = _.template('<ul data-role="listview" data-inset="true">\n  <li data-role="list-divider">Caseload</li>\n  <li><a href="#caseload">Caseload</a></li>\n  <li data-role="list-divider">Account and Sync</li> <li><a href="#sync">Sync with Bridge</a></li>\n</ul>');
      this.render();
    }
    HomeView.prototype.render = function() {
      this.el = this.activePage();
      this.el.find('.ui-content').html(this.template());
      return this.reapplyStyles(this.el);
    };
    return HomeView;
  })();
  CaseloadView = (function() {
    __extends(CaseloadView, OutbackView);
    function CaseloadView() {
      this.render = __bind(this.render, this);      CaseloadView.__super__.constructor.apply(this, arguments);
      this.template = _.template('<ul data-role="listview" data-filter="true">\n      <% clients.each(function(client){ %>\n	<li><a href="#client-<%=client.id %>"><%=client.get(\'first_name\') + " " + client.get(\'last_name\') %></a></li>\n      <% }); %>\n    </ul>');
      this.render();
    }
    CaseloadView.prototype.render = function() {
      this.el = this.activePage();
      this.el.find('.ui-content').html(this.template({
        clients: Clients
      }));
      return this.reapplyStyles(this.el);
    };
    return CaseloadView;
  })();
  ClientView = (function() {
    __extends(ClientView, OutbackView);
    function ClientView(client) {
      this.render = __bind(this.render, this);      ClientView.__super__.constructor.apply(this, arguments);
      this.template = _.template('    <h2><%=client.get(\'first_name\') + \' \' + client.get(\'last_name\') %> (<%=client.get(\'jsid\')%>)</h2>\n    <div class="ui-grid-a">\n    <div class="ui-block-a"><strong>Mobile:</strong> <a href="tel:<%=client.get(\'phone_home\')%>"><%=client.get(\'phone_home\')%></a></div>\n    <div class="ui-block-b"><strong>Home:</strong> <a href="tel:<%=client.get(\'phone_mobile\')%>"><%=client.get(\'phone_mobile\')%></a></div>\n    </div>\n    <p><strong>Email:</strong> <a href="mailto:<%=client.get(\'email\')%>"><%=client.get(\'email\')%></a></p>\n    <p>10/22 Saxon St Brunswick 3036 VIC</a></p>\n<div data-role="collapsible">\n    <h3>Client Details</h3>\n    </div>');
      this.render(client);
    }
    ClientView.prototype.render = function(client) {
      this.el = this.activePage();
      this.el.find('.ui-content').html(this.template({
        client: client
      }));
      return this.reapplyStyles(this.el);
    };
    return ClientView;
  })();
  PinView = (function() {
    __extends(PinView, OutbackView);
    function PinView(client) {
      this.render = __bind(this.render, this);      PinView.__super__.constructor.apply(this, arguments);
      this.template = _.template('<p>\nSelect a PIN to secure client data locally\n</p>\n<div class="ui-grid-h">\n<div class="ui-block-a"><strong>Mobile:</strong> <a href="tel:<%=client.get(\'phone_home\')%>"><%=client.get(\'phone_home\')%></a></div>\n<div class="ui-block-b"><strong>Home:</strong> <a href="tel:<%=client.get(\'phone_mobile\')%>"><%=client.get(\'phone_mobile\')%></a></div>\n<div class="ui-block-c"><strong>Home:</strong> <a href="tel:<%=client.get(\'phone_mobile\')%>"><%=client.get(\'phone_mobile\')%></a></div>');
      this.render(client);
    }
    PinView.prototype.render = function(client) {
      this.el = this.activePage();
      this.el.find('.ui-content').html(this.template({
        client: client
      }));
      return this.reapplyStyles(this.el);
    };
    return PinView;
  })();
  OutbackController = (function() {
    __extends(OutbackController, Backbone.Controller);
    OutbackController.prototype.routes = {
      "home": "home",
      "sync&ui-state=dialog": "login",
      "sync": "sync",
      "caseload": "caseload",
      "client-:id": "client"
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
    OutbackController.prototype.caseload = function() {
      var _base;
      return (_base = this._views)['caseload'] || (_base['caseload'] = new CaseloadView);
    };
    OutbackController.prototype.client = function(id) {
      var _base;
      return (_base = this._views)['client'] || (_base['client'] = new ClientView(Clients.get(id)));
    };
    return OutbackController;
  })();
  this.outbackController = new OutbackController;
  $(document).ready(function() {
    return Clients.fetch({
      success: function() {
        Backbone.history.start();
        return outbackController.home();
      }
    });
  });
}).call(this);
