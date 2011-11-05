class Client extends Backbone.Model
  sync: Backbone.localSync
  # start of work on meninges
  associations: {
    "contacts" : {model: "Contacts"}
  }

class ClientCollection extends Backbone.Collection
  localStorage: new Store("clients")
  sync: Backbone.localSync
  url: ->
    '/api/v1/clients/caseload.json?token=' + Users.currentUser.get('token')
  model: Client
  bridgeSync: () ->
    Users.currentUser.lastSyncStarted = new Date()
    @sync = Backbone.sync
    callbacks =
      success: =>
        models = @models
        @sync = Backbone.localSync
        chainedSaves =  @map (model) ->
          # return a callback to be used by parallel
          (callback) ->
            save_callbacks =
              success: ->
                callback(null, model.id)
              error: (error) ->
                callback(error)
            model.save null, save_callbacks
        async.parallel chainedSaves, =>
          Users.currentUser.syncing = false
          Users.currentUser.lastSync = new Date()
          Users.currentUser.lastSyncStatus = 'success'
          console.info("triggered sync")
          @trigger('clients:synced')
      error: =>
        @sync = Backbone.localSync
    @fetch(callbacks)

this.Clients = new ClientCollection
