
  describe("Clients collection", function() {
    return describe("When synchronising caseload with bridge with a valid token and no existing clients", function() {
      beforeEach(function() {
        this.token = '0d2acb7d-d4f6-4dbb-bf6e-6ebac7fa5a21';
        Users.currentUser = new Users.model({
          token: this.token
        });
        console.log(Users.currentUser);
        this.clearLocalStore();
        this.fixture = this.fixtures.Clients.valid;
        this.server = sinon.fakeServer.create();
        return this.server.respondWith("GET", "/api/v1/clients/caseload.json?token=" + this.token, this.validResponse(this.fixture));
      });
      afterEach(function() {
        this.server.restore();
        Clients.localStorage.destroyAll();
        return Clients.refresh();
      });
      it("should make the correct request", function() {
        Clients.bridgeSync();
        expect(this.server.requests.length).toEqual(1);
        expect(this.server.requests[0].method).toEqual("GET");
        return expect(this.server.requests[0].url).toEqual("/api/v1/clients/caseload.json?token=" + this.token);
      });
      it("should create client models for each client on the caseload", function() {
        Clients.bridgeSync();
        this.server.respond();
        expect(Clients.length).toEqual(this.fixture.length);
        return expect(Clients.get(1).get('first_name')).toEqual(this.fixture[0].first_name);
      });
      it("should put them into the localstore", function() {
        var storedClients;
        Clients.bridgeSync();
        this.server.respond();
        storedClients = JSON.parse(localStorage.getItem('clients'));
        return expect(_.values(storedClients).length).toEqual(this.fixture.length);
      });
      it("should create a nested collection of contacts", function() {
        var client;
        Clients.bridgeSync();
        this.server.respond();
        client = Clients.get(1);
        return expect(client.get('contacts').length).toEqual(this.fixture[0].contacts.length);
      });
      return it("should send PUT request if synced with existing clients", function() {
        Clients.bridgeSync();
        this.server.respondWith("PUT", "/api/v1/clients/caseload.json?token=" + this.token, this.validResponse(this.fixture));
        Clients.bridgeSync();
        return this.server.respond();
      });
    });
  });
