(function() {
  var Client, ClientCollection;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
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
    Client.prototype.remove_contact = function(contactUid) {
      var contacts, index;
      contacts = this.get('contacts');
      index = _.pluck(contacts, 'uid').indexOf(contactUid);
      if (index > -1) {
        contacts.splice(index, 1);
        this.save({
          contacts: contacts
        });
        return this.change();
      }
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
      Users.currentUser.lastSyncStarted = new Date();
      this.sync = Backbone.sync;
      callbacks = {
        success: __bind(function() {
          var chainedSaves, models;
          models = this.models;
          this.sync = Backbone.localSync;
          this.sync.queueSaves(Clients);
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
            this.sync.processQueuedSaves(Clients);
            Users.currentUser.syncing = false;
            Users.currentUser.lastSync = new Date();
            Users.currentUser.lastSyncStatus = 'success';
            return this.trigger('clients:synced');
          }, this));
        }, this),
        error: __bind(function() {
          this.sync = Backbone.localSync;
          return this.sync.clearQueue(Clients);
        }, this)
      };
      if (this.any()) {
        return this.fetchWithUpdate(callbacks);
      } else {
        return this.fetch(callbacks);
      }
    };
    ClientCollection.prototype.fetchWithUpdate = function(callbacks) {
      var success;
      success = __bind(function(resp) {
        this.refresh(this.parse(resp));
        if (callbacks.success) {
          return callbacks.success(this, resp);
        }
      }, this);
      return Backbone.sync('update', this, success, callbacks.error);
    };
    return ClientCollection;
  })();
  this.Clients = new ClientCollection;
}).call(this);
