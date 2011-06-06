# ### Outback: servicing job seekers in remote communities
# 
# Outback allows users to work in remote environments where internet
# connections are poor or non-existant. It does this by syncing data from the
# Bridge API (v1) and then allowing the user to access this data offline.
#
# Outback currently supports the following:
# 
# * authentication with Bridge
# * syncing the caseload
# * displaying contact details while offline
#
# Planned features:
#
# * viewing the client history while offline
# * creating contacts that can be later synced
# * viewing the referral data
# * viewing placement data
# * viewing attachments
# * secure storage on the local machine

# ## Models
class User extends Backbone.Model
  authenticated: false

# Manages user authentication
class UserCollection extends Backbone.Collection
  model: User
  
  # User who has been authenticated with Bridge
  currentUser: false

  # Attempt to authenicate the login/password with Bridge. It triggers auth:*
  # events depending on the result
  authenticate: (login, password) ->  
    $.ajax '/api/v1/users/auth.json',
      contentType: "application/json; charset=utf-8"
      dataType: "json"
      data: {login, password}
      success: (data) =>
        @currentUser = new User(data)
        @trigger('auth:authenticated', @currentUser)
      error: (jqXHR, textStatus) =>
        switch jqXHR.status
          when 401 then @trigger('auth:unauthorised')
          when 408 then @trigger('auth:timeout')
          when 500 then @trigger('auth:error:bridge')
          else @trigger('auth:error')

this.Users = new UserCollection


class Client extends Backbone.Model
  special: false

class ClientCollection extends Backbone.Collection
  localStorage: new Store("clients"),
  url: ->
    console.log("url called")
    '/api/v1/clients/caseload?token=0d2acb7d-d4f6-4dbb-bf6e-6ebac7fa5a21'
  model: Client
  bridgeSync: (token) ->
    console.log("bridgeSync called")
    @fetch()
    @forEach -> @save

this.Clients = new ClientCollection


# ## Views

# Super class for outback views with various jquery mobile helpers
class OutbackView extends Backbone.View
 
  # The jquery mobile "page" that is currently being displayed
  activePage: ->
    $(".ui-page-active")

  # Reapply the jquery mobile behaviours to the newly created page
  reapplyStyles: (el) ->
    el.find('ul[data-role]').listview();
    el.find('div[data-role="fieldcontain"]').fieldcontain();
    el.find('button[data-role="button"]').button();
    el.find('input,textarea').textinput();
    el.page()

  # use jquery mobile's redirect
  redirectTo: (page) ->
    $.mobile.changePage page

  # generic dialog
  announce: (message) ->
    $.mobile.pageLoading(true)
    # stole the ajax error from jquery mobile. hmm.. might replace with confirm
    $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h1>" + message + "</h1></div>")
      .css({ "display": "block", "opacity": 0.96, "top": $(window).scrollTop() + 100 })
      .appendTo( $.mobile.pageContainer )
      .delay( 800 )
      .fadeOut( 400, -> @remove )

# Show the status of a Sync WIth Bridge
class SyncView extends OutbackView
  constructor: ->
    super
    @el = @activePage()
    @template = _.template('''
      Welcome <%=Users.currentUser.get('name')%>
    ''')
    @render()
  render: =>
    @el.find('h1').html('Sync with Bridge')
    @el.find('.ui-content').html(@template())
    @reapplyStyles(@el)  

  
class LoginView extends OutbackView
  constructor: ->
    super
    @el = @activePage()
    Users.bind 'auth:unauthorised', =>
      $('#password').val('')
      @announce('Authentication failed. Please try again')
    Users.bind 'auth:timeout', =>
      @announce('Network timeout. Possibly wait until your connecton is better')
    Users.bind 'auth:error:bridge', =>
      @announce('Error! This has been logged and will be investigated')
    Users.bind 'auth:error', =>
      @announce('Error. Please try again later')
    Users.bind 'auth:authenticated', (user) =>
      @redirectTo('sync') 
    @template = _.template('''
    <form action="#login" method="post">
      <div data-role="fieldcontain">
        <label for="login">Login</label>
        <input type="text" value="" name="login" id="login"/>
      </div>
      <div data-role="fieldcontain">
        <label for="password">Password</label>
        <input type="password" value="" name="password" id="password"/>
      </div>
      <button data-role="button" type="submit" data-theme="b" name="submit" value="submit-value">Submit</button>
    </form>
    ''')
    @render()
  events : {
    "submit form" : "onSubmit"
  }
  render: ->
    console.log("render!")
    @el.find('h1').html('Login')
    @el.find('.ui-content').html(@template())
    @reapplyStyles(@el)  
    @delegateEvents()
  onSubmit: (e) ->
    $.mobile.pageLoading()
    Users.authenticate(
      @$("input[name='login']").val(),
      @$("input[name='password']").val()
    )
    e.preventDefault()
    e.stopPropagation()

class HomeView extends OutbackView
  constructor: ->
    super
    @el = @activePage()
    @template = _.template('''
    <ul data-role="listview" data-inset="true" data-theme="c" data-dividertheme="b">
      <li data-role="list-divider">Caseload</li>
      <li><a href="#caseload">Caseload</a></li>
      <li data-role="list-divider">Account and Sync</li> <li><a href="#sync">Sync with Bridge</a></li>
      <li><a href="#login">Login</a></li>
    </ul>
    ''')
    @render()
  render: =>
    @el.find('.ui-content').html(@template())
    @reapplyStyles(@el)  

# ## Controllers
class OutbackController extends Backbone.Controller
  routes :
    "home"  : "home"
    "sync"  : "sync"
    "login"  : "login"
  constructor: ->
    super
    @_views = {}
  home : ->
    @_views['home'] ||= new HomeView
  sync : ->
    @_views['sync'] ||= new SyncView
  login : ->
    @_views['login'] ||= new LoginView


# Start the app
$(document).ready ->
  outbackController = new OutbackController
  # controller must be instantiated before history can be started
  Backbone.history.start()
  outbackController.home()
