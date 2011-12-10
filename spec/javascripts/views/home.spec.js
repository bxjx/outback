
  describe("HomeView", function() {
    beforeEach(function() {
      this.mock = sinon.mock(Users);
      return $('body').append('<div id="home" class="ui-page-active"><div class="ui-content"></div></div>');
    });
    describe("when outback is locked and there is no secure data", function() {
      beforeEach(function() {
        this.mock.expects("unlocked").returns(false);
        this.mock.expects("secured").returns(false);
        return this.view = new HomeView();
      });
      it("should display the create new passwork link", function() {
        return expect($(this.view.el).find('a[href=#secure]').length).toEqual(1);
      });
      return it("should interact with the Users collection as expected", function() {
        return this.mock.verify();
      });
    });
    describe("when outback is locked and there is secure data", function() {
      beforeEach(function() {
        this.mock.expects("unlocked").returns(false);
        this.mock.expects("secured").returns(true);
        return this.view = new HomeView();
      });
      it("should display the unlock link", function() {
        return expect($(this.view.el).find('a[href=#unlock]').length).toEqual(1);
      });
      it("should display the reset link", function() {
        return expect($(this.view.el).find('a[href=#reset]').length).toEqual(1);
      });
      return it("should interact with the Users collection as expected", function() {
        return this.mock.verify();
      });
    });
    describe("when outback is unlocked", function() {
      beforeEach(function() {
        this.mock.expects("unlocked").returns(true);
        return this.view = new HomeView();
      });
      it("should display the sync link", function() {
        return expect($(this.view.el).find('a[href=#sync]').length).toEqual(1);
      });
      it("should display the lock link", function() {
        return expect($(this.view.el).find('a[href=#lock]').length).toEqual(1);
      });
      it("should display the reset link", function() {
        return expect($(this.view.el).find('a[href=#reset]').length).toEqual(1);
      });
      it("should display the caseload link", function() {
        return expect($(this.view.el).find('a[href=#caseload]').length).toEqual(1);
      });
      return it("should interact with the Users collection as expected", function() {
        return this.mock.verify();
      });
    });
    describe("when outback is unlocked but then User emits outback:lock:success", function() {
      beforeEach(function() {
        this.mock.expects("unlocked").returns(true);
        this.view = new HomeView();
        this.mock.verify();
        this.mock = sinon.mock(Users);
        this.mock.expects("unlocked").returns(false).atLeast(1);
        this.mock.expects("secured").returns(true).atLeast(1);
        return Users.trigger('outback:lock:success');
      });
      return it("should not render the caseload link", function() {
        return expect($(this.view.el).find('a[href=#caseload]').length).toEqual(0);
      });
    });
    return afterEach(function() {
      this.mock.restore();
      return $('.ui-page-active').remove();
    });
  });
