describe "Clients collection", ->
  
  describe "When synchronising caseload with bridge with a valid token", ->

    beforeEach ->
      @token = '0d2acb7d-d4f6-4dbb-bf6e-6ebac7fa5a21'
      Users.currentUser = new Users.model(token : @token)
      console.log(Users.currentUser)
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

    it "should make the correct request", ->
      Clients.bridgeSync()
      expect(@server.requests.length).toEqual(1)
      expect(@server.requests[0].method).toEqual("GET")
      expect(@server.requests[0].url).toEqual("/api/v1/clients/caseload.json?token=#{@token}")
    
    it "should create client models for each client on the caseload", ->
      Clients.bridgeSync('valid')
      @server.respond()
      expect(Clients.length).toEqual(@fixture.length)
      expect(Clients.get(1).get('first_name')).toEqual(@fixture[0].first_name)

    it "should put them into the localstore", ->
      Clients.bridgeSync('valid')
      @server.respond()
      storedClients = JSON.parse(localStorage.getItem('clients'))
      expect(_.values(storedClients).length).toEqual(@fixture.length)

    it "should create a nested collection of contacts", ->
      Clients.bridgeSync('valid')
      @server.respond()
      client = Clients.get(1)
      expect(client.get('contacts').length).toEqual(@fixture[0].contacts.length)
