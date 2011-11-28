describe "Clients collection", ->
  
  describe "When synchronising caseload with bridge with a valid token and no existing clients", ->

    beforeEach ->
      @token = '0d2acb7d-d4f6-4dbb-bf6e-6ebac7fa5a21'
      Users.secure('test passphrase')
      Users.currentUser = new Users.model(token : @token)
      @clearLocalStore()
      @fixture = @fixtures.Clients.valid
      @server = sinon.fakeServer.create()
      @server.respondWith(
        "GET",
        "/api/v1/clients/caseload.json?token=#{@token}",
        @validResponse(@fixture)
      )

    afterEach ->
      @server.restore()
      Clients.localStorage.destroyAll()
      Clients.refresh()

    it "should make the correct request", ->
      Clients.bridgeSync()
      expect(@server.requests.length).toEqual(1)
      expect(@server.requests[0].method).toEqual("GET")
      expect(@server.requests[0].url).toEqual("/api/v1/clients/caseload.json?token=#{@token}")
    
    it "should create client models for each client on the caseload", ->
      Clients.bridgeSync()
      @server.respond()
      expect(Clients.length).toEqual(@fixture.length)
      expect(Clients.get(1).get('first_name')).toEqual(@fixture[0].first_name)

    it "should put them encrypted into localstore", ->
      Clients.bridgeSync()
      @server.respond()
      expect(!localStorage.getItem('clients').match(/first_name/))

    it "should create a nested collection of contacts", ->
      Clients.bridgeSync()
      @server.respond()
      client = Clients.get(1)
      expect(client.get('contacts').length).toEqual(@fixture[0].contacts.length)

    it "should send PUT request if synced with existing clients", ->
      Clients.bridgeSync()
      @server.respondWith(
        "PUT",
        "/api/v1/clients/caseload.json?token=#{@token}",
        @validResponse(@fixture)
      )
      Clients.bridgeSync()
      @server.respond()
