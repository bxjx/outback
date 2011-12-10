describe "Users collection", ->

  describe "when testIfOnline is called", ->
  

    ###
    Could not get manage to stub .onLine property. Seems sinon only wants to stub methods
    describe "and navigator.onLine is false", ->

      beforeEach ->
        sinon.stub(navigator)
        @offlineTriggered = null
        Users.bind 'outback:offline', =>
          @offlineTriggered = true
        Users.testIfOnline()

      it "should emit outback:offline", ->
        expect(@offlineTriggered).toBeTruthy()
    ###

    describe "and /api/v1/users/ping returns with an error response", ->

      beforeEach ->
        @server = sinon.fakeServer.create()
        @server.respondWith(
          "GET",
          "/api/v1/users/ping",
          [408, 'timeout']
        )
        @offlineTriggered = false
        Users.bind 'outback:offline', =>
          @offlineTriggered = true
        Users.testIfOnline()

        @server.respond()
        expect(@offlineTriggered).toBeTruthy()

      afterEach ->
        @server.restore()


    describe "and /api/v1/users/ping returns with 200", ->

      beforeEach ->
        @server = sinon.fakeServer.create()
        @server.respondWith(
          "GET",
          "/api/v1/users/ping",
          [200, 'pong']
        )
        @onlineTriggered = false
        Users.bind 'outback:online', =>
          @onlineTriggered = true
        Users.testIfOnline()

      it "should emit outback:online", ->
        @server.respond()
        expect(@onlineTriggered).toBeTruthy()

      afterEach ->
        @server.restore()

