
  describe("SecureView", function() {
    beforeEach(function() {
      this.users = sinon.mock(Users);
      return this.client = Clients.create(this.fixtures.Clients.valid.first);
    });
    describe("when loaded with a client with no epp", function() {
      beforeEach(function() {
        $('body').append("<div class='ui-page-active' id='client-" + this.client.id + "'><div class='ui-content'></div></div>");
        return this.view = new ClientView(this.client);
      });
      return it("should display a message that there is no epp", function() {
        console.log($(this.view.el).html());
        return expect($(this.view.el).find('#no_epp').length).toEqual(1);
      });
    });
    describe("when loaded with a client with no epp", function() {
      beforeEach(function() {
        this.client = Clients.create(this.fixtures.Clients.valid[1]);
        $('body').append("<div class='ui-page-active' id='client-" + this.client.id + "'><div class='ui-content'></div></div>");
        return this.view = new ClientView(this.client);
      });
      return it("should display a message that there is no epp", function() {
        console.log($(this.view.el).html());
        return expect($(this.view.el).find('#no_epp').length).toEqual(0);
      });
    });
    return afterEach(function() {
      this.users.restore();
      return $('.ui-page-active').remove();
    });
  });
