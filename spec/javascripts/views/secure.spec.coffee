describe "SecureView", ->

  beforeEach ->
    @mock = sinon.mock(Users)
    $('body').append('<div class="ui-page-active" id="secure"><div class="ui-content"></div></div>')

  describe "when loaded", ->

    beforeEach ->
      @view = new SecureView()

    it "should render a password and confirmation box", ->
      expect($(@view.el).find('input[type=password][name=passphrase]').length).toEqual(1)
      expect($(@view.el).find('input[type=password][name=passphrase_confirmation]').length).toEqual(1)
