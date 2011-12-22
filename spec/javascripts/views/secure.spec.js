(function() {
  describe("SecureView", function() {
    beforeEach(function() {
      this.mock = sinon.mock(Users);
      return $('body').append('<div class="ui-page-active" id="secure"><div class="ui-content"></div></div>');
    });
    return describe("when loaded", function() {
      beforeEach(function() {
        return this.view = new SecureView();
      });
      return it("should render a password and confirmation box", function() {
        expect($(this.view.el).find('input[type=password][name=passphrase]').length).toEqual(1);
        return expect($(this.view.el).find('input[type=password][name=passphrase_confirmation]').length).toEqual(1);
      });
    });
  });
}).call(this);
