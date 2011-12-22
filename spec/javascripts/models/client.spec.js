(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  describe("Client model", function() {
    return describe("when a contact is added", function() {
      beforeEach(function() {
        Clients.localStorage = new Store('clients', 'test');
        this.client = Clients.create({
          contacts: []
        });
        return this.client.add_contact('test');
      });
      it("should update the contacts attribute", function() {
        return expect(this.client.get('contacts').length).toEqual(1);
      });
      return describe("when the contact is removed", function() {
        beforeEach(function() {
          var contact;
          contact = this.client.get('contacts')[0];
          this.changeTriggered = false;
          this.client.bind('change', __bind(function() {
            return this.changeTriggered = true;
          }, this));
          return this.client.remove_contact(contact.uid);
        });
        it("should update the contacts attribute", function() {
          return expect(this.client.get('contacts').length).toEqual(0);
        });
        return it("should emit a change event", function() {
          return expect(this.changeTriggered).toBeTruthy();
        });
      });
    });
  });
}).call(this);
