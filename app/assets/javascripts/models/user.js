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

    UserCollection.prototype.session_timeout_length = 0;

    UserCollection.prototype.timer = null;

    UserCollection.prototype.secure = function(passphrase, timeout) {
      var _this = this;
      localStorage.setItem('challenge', this.checksum("challenge:" + passphrase));
      localStorage.setItem('clients', null);
      this.unlocked = true;
      Clients.localStorage = new Store('clients', this.checksum(passphrase));
      this.setLockTimer(timeout);
      return Clients.fetch({
        success: function() {
          return _this.trigger('outback:unlock:success');
        }
      });
    };

    UserCollection.prototype.secured = function() {
      return localStorage.getItem('challenge');
    };

    UserCollection.prototype.unlock = function(passphrase, timeout) {
      var encryptionKey;
      var _this = this;
      if (this.challenge(passphrase)) {
        this.setLockTimer(timeout);
        encryptionKey = this.checksum(passphrase);
        Clients.localStorage = new Store('clients', encryptionKey);
        return Clients.fetch({
          success: function() {
            _this.unlocked = true;
            return _this.trigger('outback:unlock:success');
          }
        });
      } else {
        this.unlocked = false;
        return this.trigger('outback:unlock:failure');
      }
    };

    UserCollection.prototype.setLockTimer = function(timeout) {
      var minutes;
      minutes = parseInt(timeout);
      if (minutes < 1 || minutes > 30) minutes = 5;
      this.session_timeout_length = minutes * 60000;
      this.clearTimer();
      this.logActivity();
      return this.checkAutoLock();
    };

    UserCollection.prototype.logActivity = function() {
      return this.activity = new Date().getTime();
    };

    UserCollection.prototype.clearTimer = function() {
      if (this.timer) return window.clearInterval(this.timer);
    };

    UserCollection.prototype.checkAutoLock = function() {
      var logOutWrapper, now;
      var _this = this;
      now = new Date().getTime();
      if ((this.activity + this.session_timeout_length) < now) {
        return this.lock();
      } else {
        logOutWrapper = function() {
          return _this.checkAutoLock();
        };
        this.clearTimer();
        return this.timer = window.setInterval(logOutWrapper, 5000);
      }
    };

    UserCollection.prototype.lock = function() {
      this.clearTimer();
      this.unlocked = false;
      Clients.localStorage = null;
      return this.trigger('outback:lock:success');
    };

    UserCollection.prototype.challenge = function(password) {
      var attempt, challenge;
      attempt = this.checksum("challenge:" + password);
      challenge = localStorage.getItem('challenge');
      return attempt === challenge;
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
