describe "ResetView", ->

  beforeEach ->
    @mock = sinon.mock(Users)
    $('body').append('<div id="reset" class="ui-page-active"><div class="ui-content"></div></div>')
    @view = new ResetView

    it "should display a button to reset data", ->
      expect($(@view.el).find('button').length).toEqual(1)

    describe "when the form is submitted", ->
      
      beforeEach ->
        @mock.expects("erase")
        @resetTriggered = false
        @view.el.find('form').submit()

      it "should call Users.erase()", ->
        @mock.verify()

  afterEach ->
    @mock.restore()
    $('.ui-page-active').remove()
