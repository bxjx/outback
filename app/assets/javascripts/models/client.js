(function() {
  var Client, ClientCollection;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Client = (function() {

    __extends(Client, Backbone.Model);

    function Client() {
      Client.__super__.constructor.apply(this, arguments);
    }

    Client.prototype.sync = Backbone.localSync;

    Client.prototype.add_contact = function(notes, callbacks) {
      var contact_data, contacts;
      contacts = this.get('contacts');
      contact_data = {
        'notes': notes,
        'created_at': new Date(),
        'synced': false,
        'uid': guid()
      };
      if (Users.currentUser) {
        contact_data['user_name'] = Users.currentUser.get('name');
      }
      contacts.unshift(contact_data);
      this.change();
      return this.save({
        'contacts': contacts
      }, callbacks);
    };

    return Client;

  })();

  ClientCollection = (function() {

    __extends(ClientCollection, Backbone.Collection);

    function ClientCollection() {
      ClientCollection.__super__.constructor.apply(this, arguments);
    }

    ClientCollection.prototype.localStorage = null;

    ClientCollection.prototype.sync = Backbone.localSync;

    ClientCollection.prototype.url = function() {
      return '/api/v1/clients/caseload.json?token=' + Users.currentUser.get('token');
    };

    ClientCollection.prototype.model = Client;

    ClientCollection.prototype.bridgeSync = function() {
      var callbacks;
      var _this = this;
      Users.currentUser.lastSyncStarted = new Date();
      this.sync = Backbone.sync;
      callbacks = {
        success: function() {
          var chainedSaves, models;
          models = _this.models;
          _this.sync = Backbone.localSync;
          _this.sync.queueSaves(Clients);
          chainedSaves = _this.map(function(model) {
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
          return async.parallel(chainedSaves, function() {
            _this.sync.processQueuedSaves(Clients);
            Users.currentUser.syncing = false;
            Users.currentUser.lastSync = new Date();
            Users.currentUser.lastSyncStatus = 'success';
            return _this.trigger('clients:synced');
          });
        },
        error: function() {
          _this.sync = Backbone.localSync;
          return _this.sync.clearQueue(Clients);
        }
      };
      if (this.any()) {
        return this.fetchWithUpdate(callbacks);
      } else {
        return this.fetch(callbacks);
      }
    };

    ClientCollection.prototype.fetchWithUpdate = function(callbacks) {
      var success;
      var _this = this;
      success = function(resp) {
        _this.refresh(_this.parse(resp));
        if (callbacks.success) return callbacks.success(_this, resp);
      };
      return Backbone.sync('update', this, success, callbacks.error);
    };

    return ClientCollection;

  })();

  this.Clients = new ClientCollection;

}).call(this);
