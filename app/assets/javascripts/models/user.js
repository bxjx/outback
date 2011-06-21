(function() {
  var User, UserCollection;
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
}).call(this);
