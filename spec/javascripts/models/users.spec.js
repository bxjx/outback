
  describe("Users collection", function() {
    return describe("when testIfOnline is called", function() {
      /*
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
      */      describe("and /api/v1/users/ping returns with an error response", function() {
        beforeEach(function() {
          var _this = this;
          this.server = sinon.fakeServer.create();
          this.server.respondWith("GET", "/api/v1/users/ping", [408, 'timeout']);
          this.offlineTriggered = false;
          Users.bind('outback:offline', function() {
            return _this.offlineTriggered = true;
          });
          Users.testIfOnline();
          this.server.respond();
          return expect(this.offlineTriggered).toBeTruthy();
        });
        return afterEach(function() {
          return this.server.restore();
        });
      });
      return describe("and /api/v1/users/ping returns with 200", function() {
        beforeEach(function() {
          var _this = this;
          this.server = sinon.fakeServer.create();
          this.server.respondWith("GET", "/api/v1/users/ping", [200, 'pong']);
          this.onlineTriggered = false;
          Users.bind('outback:online', function() {
            return _this.onlineTriggered = true;
          });
          return Users.testIfOnline();
        });
        it("should emit outback:online", function() {
          this.server.respond();
          return expect(this.onlineTriggered).toBeTruthy();
        });
        return afterEach(function() {
          return this.server.restore();
        });
      });
    });
  });
