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
  locked: true
  
  # Milliseconds of inactivity until the session is locked
  session_timeout_length: 0

  # Rerence to session timeout timer
  timer: null

  unlocked: ->
    @locked

  # Set up an encrypted localStorage with the passphrase. All existing data
  # will be lost
  secure: (passphrase, timeout) ->
    localStorage.setItem('challenge', @checksum("challenge:#{passphrase}"))
    localStorage.setItem('clients', null)
    @locked = false
    Clients.localStorage = new Store('clients', @checksum(passphrase))
    @setLockTimer(timeout)
    Clients.fetch success: =>
      @trigger('outback:unlock:success')

  secured: ->
    localStorage.getItem('challenge')

  unlock: (passphrase, timeout) ->
    if @challenge(passphrase)
      @setLockTimer(timeout)
      encryptionKey = @checksum(passphrase)
      Clients.localStorage = new Store('clients', encryptionKey)
      Clients.fetch success: =>
        @locked = false
        @trigger('outback:unlock:success')
    else
      @locked = true
      # emit failure so they can try again
      @trigger('outback:unlock:failure')

  # Set up timer to boot the user off i.e. lock the application
  setLockTimer: (timeout)->
    minutes = parseInt(timeout)
    if minutes < 1 or minutes > 30
      minutes = 5
    @session_timeout_length = minutes * 60000
    @clearTimer()
    @logActivity()
    @checkAutoLock()

  # Update a record of the last activity of the user
  logActivity: ->
    @activity = new Date().getTime()

  clearTimer: ->
    if @timer 
      window.clearInterval(@timer)

  # Run periodically to check if they need to be auto logged out
  checkAutoLock: ->
    now = new Date().getTime()
    if (@activity + @session_timeout_length) < now
      @lock()
    else
      logOutWrapper = =>
        @checkAutoLock()
      @clearTimer()
      @timer = window.setInterval logOutWrapper, 5000
        
  lock: ->
    # clear client storage
    @clearTimer()
    @locked = true
    Clients.localStorage = null
    @trigger('outback:lock:success')

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
