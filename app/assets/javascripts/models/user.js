(function() {
  var User, UserCollection;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

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

    UserCollection.prototype.unlocked = false;

    UserCollection.prototype.secured = function() {
      return Clients.localStorage && Clients.localStorage.key;
    };

    UserCollection.prototype.secure = function(passphrase) {
      var key;
      var _this = this;
      key = this.checksum(passphrase);
      localStorage.setItem('key', key);
      localStorage.setItem('clients', null);
      this.unlocked = true;
      Clients.localStorage = new Store('clients', key);
      return Clients.fetch({
        success: function() {
          return _this.trigger('outback:unlock:success');
        }
      });
    };

    UserCollection.prototype.secured = function() {
      return localStorage.getItem('key');
    };

    UserCollection.prototype.unlock = function(passphrase) {
      var key;
      var _this = this;
      key = localStorage.getItem('key', key);
      if (this.checksum(passphrase) === key) {
        Clients.localStorage = new Store('clients', key);
        return Clients.fetch({
          success: function() {
            _this.unlocked = true;
            return _this.trigger('outback:unlock:success');
          }
        });
      } else {
        return this.trigger('outback:unlock:failed');
      }
    };

    UserCollection.prototype.checksum = function(text) {
      return new jsSHA(text, "ASCII").getHash("SHA-512", "HEX");
    };

    UserCollection.prototype.authenticate = function(login, password) {
      var _this = this;
      return $.ajax('/api/v1/users/auth.json', {
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: {
          login: login,
          password: password
        },
        success: function(data) {
          _this.currentUser = new User(data);
          _this.currentUser.authenticated = true;
          _this.currentUser.startSync();
          return _this.trigger('auth:authenticated', _this.currentUser);
        },
        error: function(jqXHR, textStatus) {
          switch (jqXHR.status) {
            case 401:
              return _this.trigger('auth:unauthorised');
            case 408:
              return _this.trigger('auth:timeout');
            case 500:
              return _this.trigger('auth:error:bridge');
            default:
              return _this.trigger('auth:error');
          }
        }
      });
    };

    return UserCollection;

  })();

  this.Users = new UserCollection;

}).call(this);
