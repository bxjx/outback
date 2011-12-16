describe "Client model", ->

  describe "when a contact is added", ->

    beforeEach ->
      Clients.localStorage = new Store('clients', 'test')
      @client = Clients.create(contacts: [])
      @client.add_contact('test')

    it "should update the contacts attribute", ->
      expect(@client.get('contacts').length).toEqual(1)

    describe "when the contact is removed", ->
      beforeEach ->
        contact = @client.get('contacts')[0]
        @changeTriggered = false
        @client.bind 'change', =>
          @changeTriggered = true
        @client.remove_contact(contact.uid)

      it "should update the contacts attribute", ->
        expect(@client.get('contacts').length).toEqual(0)

      it "should emit a change event", ->
        expect(@changeTriggered).toBeTruthy()
