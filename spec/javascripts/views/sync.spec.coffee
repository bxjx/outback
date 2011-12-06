describe "SyncView", ->

  beforeEach ->
    @mock = sinon.mock(Users)
    $('body').append('<div class="ui-page-active" id="sync"><div class="ui-content"></div></div>')

  describe "when loaded and the app is not online", ->

    beforeEach ->
      @mock.expects("testIfOnline")
      @view = new SyncView()

    it "should check that the app is online", ->
      @mock.verify()

    it "should render loading status while waiting", ->
      expect($(@view.el).find('span.loading').length).toEqual(1)

  describe "when User event outback:offline is triggered", ->

    beforeEach ->
      @mock.expects("testIfOnline")
      @view = new SyncView()
      Users.trigger('outback:offline')

    it "should warn the user that the app does not appear to be online but allow them to login anyway", ->
      expect($(@view.el).find('#offline_warning').length).toEqual(1)
      expect($(@view.el).find('a[href=#login]').length).toEqual(1)

  describe "when User event outback:online is triggered", ->

    beforeEach ->
      @mock.expects("testIfOnline")
      @view = new SyncView()
      Users.trigger('outback:online')

    it "should dispaly the login link", ->
      expect($(@view.el).find('a[href=#login]').length).toEqual(1)

    it "should NOT display the offline warning", ->
      expect($(@view.el).find('#offline_warning').length).toEqual(0)
      
  afterEach ->
    @mock.restore()
    $('.ui-page-active').remove()
