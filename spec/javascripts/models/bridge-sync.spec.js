(function() {
  describe("BridgeSync instance", function() {
    describe("sync called with a valid username and password", function() {
      describe("with the api available via the network", function() {
        it("should make the correct auth request", function() {});
        describe("Users.currentUser", function() {
          it("should be set with details from the api");
          return it("should store the api token");
        });
        it("should update the last successful auth");
        it("should emit auth:authenticated");
        it("should make the correct caseload request");
        describe("Clients collection", function() {
          it("should create client models for each client on the caseload");
          return it("should store them in the local store");
        });
        it("should update the last caseload sync");
        it("should emit clients:synced");
        return it("should update the last successful complete sync");
      });
      describe("with a network error on auth", function() {
        it("should emit auth:error:*");
        return it("should update the last authenticated");
      });
      return describe("with a network error on caseload sync", function() {
        it("should emit clients:error:*");
        return it("should update the last caseload sync");
      });
    });
    return describe("called with an invalid username and password", function() {
      it("should emit auth:error:*");
      return it("should update the last authenticated");
    });
  });
}).call(this);
