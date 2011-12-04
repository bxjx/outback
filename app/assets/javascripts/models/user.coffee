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

  # Set up an encrypted localStorage with the passphrase. All existing data
  # will be lost
  secure: (passphrase) ->
    localStorage.setItem('challenge', @checksum("challenge:#{passphrase}"))
    localStorage.setItem('clients', null)
    @unlocked = true
    Clients.localStorage = new Store('clients', @checksum(passphrase))
    Clients.fetch success: =>
      @trigger('outback:unlock:success')

  secured: ->
    localStorage.getItem('challenge')

  unlock: (passphrase) ->
    if challenge(passphrase)
      encryptionKey = @checksum(passphrase)
      Clients.localStorage = new Store('clients', encryptionKey)
      Clients.fetch success: =>
        @unlocked = true
        @trigger('outback:unlock:success')
    else
      @unlocked = false
      # emit failure so they can try again
      @trigger('outback:unlock:failure')

  lock: ->
    # clear client storage
    @unlocked = true
    Clients.localStorage = null
    @trigger('outback:unlocked:success')

  challenge: (password)->
    attempt = @checksum("challenge:#{password}")
    challenge = localStorage.getItem('challenge')
    attempt is challenge

  
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
