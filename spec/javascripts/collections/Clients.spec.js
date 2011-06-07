(function() {
  describe("Client collection", function() {
    return describe("When synchronising caseload with bridge with a valid token", function() {
      beforeEach(function() {
        this.clearLocalStore();
        this.fixture = this.fixtures.Clients.valid;
        this.server = sinon.fakeServer.create();
        return this.server.respondWith("GET", "/api/v1/clients/caseload.json?token=0d2acb7d-d4f6-4dbb-bf6e-6ebac7fa5a21", this.validResponse(this.fixture));
      });
      afterEach(function() {
        return this.server.restore();
      });
      it("should make the correct request", function() {
        Clients.bridgeSync();
        expect(this.server.requests.length).toEqual(1);
        expect(this.server.requests[0].method).toEqual("GET");
        return expect(this.server.requests[0].url).toEqual("/api/v1/clients/caseload.json?token=0d2acb7d-d4f6-4dbb-bf6e-6ebac7fa5a21");
      });
      it("should create client models for each client on the caseload", function() {
        Clients.bridgeSync('valid');
        this.server.respond();
        expect(Clients.length).toEqual(this.fixture.length);
        return expect(Clients.get(1).get('first_name')).toEqual(this.fixture[0].first_name);
      });
      return it("should put them into the localstore", function() {
        var storedClients;
        Clients.bridgeSync('valid');
        this.server.respond();
        storedClients = JSON.parse(localStorage.getItem('clients'));
        return expect(_.values(storedClients).length).toEqual(this.fixture.length);
      });
    });
  });
}).call(this);
