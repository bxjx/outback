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
    Client.prototype.associations = {
      "contacts": {
        model: "Contacts"
      }
    };
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
}).call(this);
