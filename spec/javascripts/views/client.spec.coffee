describe "SecureView", ->

  beforeEach ->
    @users = sinon.mock(Users)
    @client = Clients.create(@fixtures.Clients.valid.first)

  describe "when loaded with a client with no epp", ->

    beforeEach ->
      $('body').append("<div class='ui-page-active' id='client-#{@client.id}'><div class='ui-content'></div></div>")
      @view = new ClientView(@client)

    it "should display a message that there is no epp", ->
      console.log($(@view.el).html())
      expect($(@view.el).find('#no_epp').length).toEqual(1)

  describe "when loaded with a client with no epp", ->

    beforeEach ->
      @client = Clients.create(@fixtures.Clients.valid[1])
      $('body').append("<div class='ui-page-active' id='client-#{@client.id}'><div class='ui-content'></div></div>")
      @view = new ClientView(@client)

    it "should display a message that there is no epp", ->
      console.log($(@view.el).html())
      expect($(@view.el).find('#no_epp').length).toEqual(0)

  afterEach ->
    @users.restore()
    $('.ui-page-active').remove()
