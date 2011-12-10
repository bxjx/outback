class LoginView extends OutbackView
  constructor: ->
    super
    @page = 'login'
    Users.bind 'auth:unauthorised', =>
      @announce('Authentication failed. Please try again')
    Users.bind 'auth:timeout', =>
      @announce('Network timeout. Possibly wait until your connecton is better')
    Users.bind 'auth:error:bridge', =>
      @announce('Error! This has been logged and will be investigated')
    Users.bind 'auth:error', =>
      @announce('Error. Please try again later')
    @template = _.template('''
    <form action="#login" method="post">
      <div data-role="fieldcontain">
        <label for="login">Login (e.g. EX2003)</label>
        <input type="text" value="" name="login" id="login"/>
      </div>
      <div data-role="fieldcontain">
        <label for="password">Password</label>
        <input type="password" value="" name="password" id="password"/>
      </div>
      <div class="ui-grid-a">
      <div class="ui-block-a">
        <a data-role="button" href="#" data-theme="c" data-rel="back">Cancel</a>
      </div>
      <div class="ui-block-b">
        <button data-theme="b" data-role="button" type="submit" name="submit" value="submit-value">Submit</button>
     </div>
      </div>
    </form>
    ''')
    @render()
  events : {
    "submit form" : "onSubmit"
  }
  render: ->
    @el = @activePage()
    @el.find('h1').html('Bridge Login')
    @el.find('.ui-content').html(@template())
    @reapplyStyles(@el)
    @delegateEvents()
  onSubmit: (e) ->
    $.mobile.pageLoading()
    Users.authenticate(
      @$("input[name='login']").val(),
      @$("input[name='password']").val()
    )
    @$("input[name='password']").val('')
    e.preventDefault()
    e.stopPropagation()

this.LoginView = LoginView
