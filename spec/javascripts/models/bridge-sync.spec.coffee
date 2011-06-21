describe "BridgeSync instance", ->
  describe "sync called with a valid username and password", ->
    describe "with the api available via the network", ->
      it "should make the correct auth request", ->
      describe "Users.currentUser", ->
        it "should be set with details from the api"
        it "should store the api token"
      it "should update the last successful auth"
      it "should emit auth:authenticated"
      it "should make the correct caseload request"
      describe "Clients collection", ->
        it "should create client models for each client on the caseload"
        it "should store them in the local store"
      it "should update the last caseload sync"
      it "should emit clients:synced"
      it "should update the last successful complete sync"

    describe "with a network error on auth", ->
      it "should emit auth:error:*"
      it "should update the last authenticated"
    describe "with a network error on caseload sync", ->
      it "should emit clients:error:*"
      it "should update the last caseload sync"

  describe "called with an invalid username and password", ->
    it "should emit auth:error:*"
    it "should update the last authenticated"
