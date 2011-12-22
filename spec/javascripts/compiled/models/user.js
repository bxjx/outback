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
    UserCollection.prototype.locked = true;
    UserCollection.prototype.session_timeout_length = 0;
    UserCollection.prototype.timer = null;
    UserCollection.prototype.unlocked = function() {
      return !this.locked;
    };
    UserCollection.prototype.testIfOnline = function() {
      if (!navigator.onLine) {
        return this.trigger('outback:offline');
      } else {
        return $.ajax('/api/v1/users/ping', {
          success: __bind(function(data) {
            return this.trigger('outback:online');
          }, this),
          error: __bind(function(jqXHR, textStatus) {
            return this.trigger('outback:offline');
          }, this)
        });
      }
    };
    UserCollection.prototype.secure = function(passphrase, timeout) {
      localStorage.setItem('challenge', this.checksum("challenge:" + passphrase));
      localStorage.setItem('clients', null);
      this.locked = false;
      Clients.localStorage = new Store('clients', this.checksum(passphrase));
      this.setLockTimer(timeout);
      return Clients.fetch({
        success: __bind(function() {
          return this.trigger('outback:unlock:success');
        }, this)
      });
    };
    UserCollection.prototype.secured = function() {
      return localStorage.getItem('challenge');
    };
    UserCollection.prototype.unlock = function(passphrase, timeout) {
      var encryptionKey;
      if (this.challenge(passphrase)) {
        this.setLockTimer(timeout);
        encryptionKey = this.checksum(passphrase);
        Clients.localStorage = new Store('clients', encryptionKey);
        return Clients.fetch({
          success: __bind(function() {
            this.locked = false;
            return this.trigger('outback:unlock:success');
          }, this)
        });
      } else {
        this.locked = true;
        return this.trigger('outback:unlock:failure');
      }
    };
    UserCollection.prototype.setLockTimer = function(timeout) {
      var minutes;
      minutes = parseInt(timeout);
      if (minutes < 1 || minutes > 30) {
        minutes = 5;
      }
      this.session_timeout_length = minutes * 60000;
      this.clearTimer();
      this.logActivity();
      return this.checkAutoLock();
    };
    UserCollection.prototype.erase = function() {
      localStorage.removeItem('challenge', null);
      localStorage.removeItem('clients', null);
      this.clearTimer();
      this.locked = true;
      Clients.localStorage = null;
      return this.trigger('outback:reset');
    };
    UserCollection.prototype.logActivity = function() {
      return this.activity = new Date().getTime();
    };
    UserCollection.prototype.clearTimer = function() {
      if (this.timer) {
        return window.clearInterval(this.timer);
      }
    };
    UserCollection.prototype.checkAutoLock = function() {
      var logOutWrapper, now;
      now = new Date().getTime();
      if ((this.activity + this.session_timeout_length) < now) {
        return this.lock();
      } else {
        logOutWrapper = __bind(function() {
          return this.checkAutoLock();
        }, this);
        this.clearTimer();
        return this.timer = window.setInterval(logOutWrapper, 5000);
      }
    };
    UserCollection.prototype.lock = function() {
      this.clearTimer();
      this.locked = true;
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
      return $.ajax('/api/v1/users/auth.json', {
        dataType: "json",
        type: 'POST',
        data: {
          login: login,
          password: password
        },
        success: __bind(function(data) {
          this.currentUser = new User(data);
          this.currentUser.authenticated = true;
          this.currentUser.startSync();
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
