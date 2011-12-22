(function() {
  describe("SyncView", function() {
    beforeEach(function() {
      this.mock = sinon.mock(Users);
      return $('body').append('<div class="ui-page-active" id="sync"><div class="ui-content"></div></div>');
    });
    describe("when loaded and the app is not online", function() {
      beforeEach(function() {
        this.mock.expects("testIfOnline");
        return this.view = new SyncView();
      });
      it("should check that the app is online", function() {
        return this.mock.verify();
      });
      return it("should render loading status while waiting", function() {
        return expect($(this.view.el).find('span.loading').length).toEqual(1);
      });
    });
    describe("when User event outback:offline is triggered", function() {
      beforeEach(function() {
        this.mock.expects("testIfOnline");
        this.view = new SyncView();
        return Users.trigger('outback:offline');
      });
      return it("should warn the user that the app does not appear to be online but allow them to login anyway", function() {
        expect($(this.view.el).find('#offline_warning').length).toEqual(1);
        return expect($(this.view.el).find('a[href=#login]').length).toEqual(1);
      });
    });
    describe("when User event outback:online is triggered", function() {
      beforeEach(function() {
        this.mock.expects("testIfOnline");
        this.view = new SyncView();
        return Users.trigger('outback:online');
      });
      it("should dispaly the login link", function() {
        return expect($(this.view.el).find('a[href=#login]').length).toEqual(1);
      });
      return it("should NOT display the offline warning", function() {
        return expect($(this.view.el).find('#offline_warning').length).toEqual(0);
      });
    });
    return afterEach(function() {
      this.mock.restore();
      return $('.ui-page-active').remove();
    });
  });
}).call(this);
