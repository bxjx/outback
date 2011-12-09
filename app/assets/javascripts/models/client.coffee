class Client extends Backbone.Model
  sync: Backbone.localSync

  # Add a contact to be synced later. Callbacks can be passed as {error..,
  # succes..}. It will also trigger change event. I might move this to events
  # in the future
  add_contact: (notes, callbacks) ->
    contacts = @get('contacts')
    contact_data =
      'notes': notes
      'created_at': new Date()
      'synced': false
      'uid': guid()
    if Users.currentUser
      contact_data['user_name'] = Users.currentUser.get('name')
    contacts.unshift contact_data
    @change() # maybe this shouldn't be used or only on success?
    @save({'contacts': contacts}, callbacks)

class ClientCollection extends Backbone.Collection
  # setup local storage of clients
  localStorage: null
  sync: Backbone.localSync
  url: ->
    '/api/v1/clients/caseload.json?token=' + Users.currentUser.get('token')
  model: Client

  # Get clients on the user's caseload from the API and then store them in the
  # local store
  bridgeSync: () ->
    Users.currentUser.lastSyncStarted = new Date()
    @sync = Backbone.sync
    callbacks =
      success: =>
        models = @models
        @sync = Backbone.localSync
        window.syncer = @sync
        @sync.queueSaves(Clients)
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
          @sync.processQueuedSaves(Clients)
          Users.currentUser.syncing = false
          Users.currentUser.lastSync = new Date()
          Users.currentUser.lastSyncStatus = 'success'
          @trigger('clients:synced')
      error: =>
        @sync = Backbone.localSync
        @sync.clearQueue(Clients)
    if @any()
      @fetchWithUpdate(callbacks)
    else
      @fetch(callbacks)

  # Similar to default fetch but will call sync with update
  fetchWithUpdate: (callbacks) ->
    success = (resp) =>
      @refresh(@parse(resp))
      if (callbacks.success) then callbacks.success(this, resp)
    Backbone.sync('update', this, success, callbacks.error)

this.Clients = new ClientCollection
