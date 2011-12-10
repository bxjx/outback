
  describe("ResetView", function() {
    beforeEach(function() {
      this.mock = sinon.mock(Users);
      $('body').append('<div id="reset" class="ui-page-active"><div class="ui-content"></div></div>');
      this.view = new ResetView;
      it("should display a button to reset data", function() {
        return expect($(this.view.el).find('button').length).toEqual(1);
      });
      return describe("when the form is submitted", function() {
        beforeEach(function() {
          this.mock.expects("erase");
          this.resetTriggered = false;
          return this.view.el.find('form').submit();
        });
        return it("should call Users.erase()", function() {
          return this.mock.verify();
        });
      });
    });
    return afterEach(function() {
      this.mock.restore();
      return $('.ui-page-active').remove();
    });
  });
