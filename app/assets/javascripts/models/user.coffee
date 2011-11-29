# Models the Outback/Bridge user
class User extends Backbone.Model
  authenticated: false
  syncing: false
  lastSync: null
  lastSyncStatus: null
  startSync: ->
    @syncing = true
    Clients.bridgeSync()

# Manages user authentication
class UserCollection extends Backbone.Collection
  model: User
  
  # User who has been authenticated with Bridge
  currentUser: false

  # true if outback data has been successfully unlocked and decrypted
  unlocked: false

  # secured if we've got an encryption key set TODO: see if you can alias in
  # coffescript
  secured: ->
    Clients.localStorage && Clients.localStorage.key

  secure: (passphrase) ->
    key = @checksum(passphrase)
    localStorage.setItem('key', key)
    localStorage.setItem('clients', null)
    @unlocked = true
    Clients.localStorage = new Store('clients', key)
    Clients.fetch success: =>
      @trigger('outback:unlock:success')

  secured: ->
    localStorage.getItem('key')

  unlock: (passphrase) ->
    key = localStorage.getItem('key', key)
    if @checksum(passphrase) is key
      Clients.localStorage = new Store('clients', key)
      Clients.fetch success: =>
        @unlocked = true
        @trigger('outback:unlock:success')
    else
      # emit failure so they can try again
      @trigger('outback:unlock:failed')

  checksum: (text)->
    new jsSHA(text, "ASCII").getHash("SHA-512", "HEX");
    

  # Attempt to authenicate the login/password with Bridge. It triggers auth:*
  # events depending on the result
  authenticate: (login, password) ->
    $.ajax '/api/v1/users/auth.json',
      contentType: "application/json; charset=utf-8"
      dataType: "json"
      data: {login, password}
      success: (data) =>
        @currentUser = new User(data)
        @currentUser.authenticated = true
        @currentUser.startSync()
        @trigger('auth:authenticated', @currentUser)
      error: (jqXHR, textStatus) =>
        switch jqXHR.status
          when 401 then @trigger('auth:unauthorised')
          when 408 then @trigger('auth:timeout')
          when 500 then @trigger('auth:error:bridge')
          else @trigger('auth:error')

this.Users = new UserCollection
