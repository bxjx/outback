describe "HomeView", ->

  beforeEach ->
    @mock = sinon.mock(Users)
    $('body').append('<div class="ui-page-active"><div class="ui-content"></div></div>')

  describe "when outback is locked and there is no secure data", ->

    beforeEach ->
      @mock.expects("unlocked").returns(false)
      @mock.expects("secured").returns(false)
      @view = new HomeView()

    it "should display the create new passwork link", ->
      expect($(@view.el).find('a[href=#secure]').length).toEqual(1)

    it "should interact with the Users collection as expected", ->
      @mock.verify()

  describe "when outback is locked and there is secure data", ->

    beforeEach ->
      @mock.expects("unlocked").returns(false)
      @mock.expects("secured").returns(true)
      @view = new HomeView()

    it "should display the unlock link", ->
      expect($(@view.el).find('a[href=#unlock]').length).toEqual(1)

    it "should display the reset link", ->
      expect($(@view.el).find('a[href=#secure]').length).toEqual(1)

    it "should interact with the Users collection as expected", ->
      @mock.verify()

  describe "when outback is unlocked", ->

    beforeEach ->
      @mock.expects("unlocked").returns(true)
      @view = new HomeView()

    it "should display the sync link", ->
      expect($(@view.el).find('a[href=#sync]').length).toEqual(1)

    it "should display the lock link", ->
      expect($(@view.el).find('a[href=#lock]').length).toEqual(1)

    it "should display the caseload link", ->
      expect($(@view.el).find('a[href=#caseload]').length).toEqual(1)

    it "should interact with the Users collection as expected", ->
      @mock.verify()

  describe "when outback is unlocked but then User emits outback:lock:success", ->
    beforeEach ->
      @mock.expects("unlocked").returns(true)
      @view = new HomeView()
      @mock.verify()
      @mock.expects("unlocked").returns(false).atLeast(1)
      @mock.expects("secured").returns(true).atLeast(1)
      Users.trigger('outback:lock:success')

    it "should not render the caseload link", ->
      expect($(@view.el).find('a[href=#caseload]').length).toEqual(0)

  afterEach ->
    @mock.restore()
    $('.ui-page-active').remove()
