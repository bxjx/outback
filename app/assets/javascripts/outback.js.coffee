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
# * viewing appointments in local calendar app
#
# Current Issues
#
# * handling errors during sync
# * refactor syncing events
# * pressing the cancel button at any time during sync

# ## Models
class User extends Backbone.Model
  authenticated: false
  syncing: false
  lastSync: null
  lastSyncStatus: null
  startSync: ->
    console.log("starting sync")
    @syncing = true
    Clients.bridgeSync()

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
        @currentUser.authenticated = true
        @currentUser.startSync()
        console.log("about to trigger ==== " + Users.currentUser.syncing)
        @trigger('auth:authenticated', @currentUser)
      error: (jqXHR, textStatus) =>
        switch jqXHR.status
          when 401 then @trigger('auth:unauthorised')
          when 408 then @trigger('auth:timeout')
          when 500 then @trigger('auth:error:bridge')
          else @trigger('auth:error')

this.Users = new UserCollection

class Client extends Backbone.Model
  sync: Backbone.localSync

class ClientCollection extends Backbone.Collection
  localStorage: new Store("clients")
  sync: Backbone.localSync
  url: ->
    '/api/v1/clients/caseload.json?token=' + Users.currentUser.get('token')
  model: Client
  bridgeSync: () ->
    Users.currentUser.lastSyncStarted = new Date()
    @sync = Backbone.sync
    callbacks =
      success: =>
        models = @models
        @sync = Backbone.localSync
        chainedSaves =  @map (model) ->
          # return a callback to be used by parallel
          (callback) ->
            save_callbacks =
              success: ->
                callback(null, model.id)
              error: (error) ->
                callback(error)
            model.save null, save_callbacks
        async.parallel chainedSaves, =>
          Users.currentUser.syncing = false
          Users.currentUser.lastSync = new Date()
          Users.currentUser.lastSyncStatus = 'success'
          console.info("triggered sync")
          @trigger('clients:synced')
      error: =>
        @sync = Backbone.localSync
    @fetch(callbacks)

this.Clients = new ClientCollection

# ## Views

# Super class for outback views with various jquery mobile helpers
class OutbackView extends Backbone.View
 
  # The jquery mobile "page" that is currently being displayed
  activePage: ->
    $(".ui-page-active")

  # Reapply the jquery mobile behaviours to the newly created page
  reapplyStyles: (el) ->
    el.find('ul[data-role]').listview()
    el.find('div[data-role="fieldcontain"]').fieldcontain()
    el.find('button[data-role="button"],a[data-role="button"]').button()
    el.find('input,textarea').textinput()
    el.find('div[data-role="collapsible"]').collapsible()
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

  # convert date to iso format
  isoDate : (d) ->
    pad = (n)->
      if n < 10 then  "0" + n else  n
    "#{d.getUTCFullYear()}-#{pad(d.getUTCMonth()+1)}-#{pad(d.getUTCDate())}T#{pad(d.getUTCHours())}:#{pad(d.getUTCMinutes())}:#{pad(d.getUTCSeconds())}Z"

# Show the status of a Sync WIth Bridge
class SyncView extends OutbackView
  constructor: ->
    super
    @template = _.template('''
      <% if (Users.currentUser && Users.currentUser.syncing){ %>
      <a data-role="button" data-theme="b" id="#cancel">Cancel Sync</a>
      <% }else{ %>
      <a href="#login" data-rel="dialog" data-transition="flip" data-role="button" data-icon="refresh">Sync with Bridge</a>
      <% }%>
      
      <% if (Users.currentUser && Users.currentUser.lastSyncStarted){ %>
        <ul id="sync-status" data-role="listview">
          <li id="sync_step_authenticate">Authenticate with Bridge <span class="ui-icon status complete"></status></li>
          <li id="sync_step_caseload">Sync Caseload<span class="ui-icon status <%= Users.currentUser.lastSync ? 'complete' : 'loading'%>"></status></li>
          <% if (Users.currentUser && Users.currentUser.lastSyncStatus){ %>
          <li>Last sync successfully completed <abbrev class="timeago" title="<%=this.isoDate(Users.currentUser.lastSync)%>"></abbrev</li>
          <% } %>
        </ul>
      <% } %>
    ''')
    Users.bind 'auth:authenticated', (user) =>
      $('.ui-dialog').dialog('close')
      @render()
    Clients.bind 'clients:synced', =>
      @render()
    @render()
  render: =>
    @el = $('#sync')
    @el.find('h1').html('Sync with Bridge')
    @el.find('.ui-content').html(@template())
    $("abbrev.timeago").timeago()
    @reapplyStyles(@el)

  
class LoginView extends OutbackView
  constructor: ->
    super
    Users.bind 'auth:unauthorised', =>
      $('#password').val('')
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
    console.info("adding content");
    @reapplyStyles(@el)
    console.info("applying");
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
    @template = _.template('''
    <ul data-role="listview" data-inset="true">
      <li data-role="list-divider">Caseload</li>
      <li><a href="#caseload">Caseload</a></li>
      <li data-role="list-divider">Account and Sync</li> <li><a href="#sync">Sync with Bridge</a></li>
    </ul>
    ''')
    @render()
  render: =>
    @el = @activePage()
    @el.find('.ui-content').html(@template())
    @reapplyStyles(@el)

class CaseloadView extends OutbackView
  constructor: ->
    super
    @template = _.template('''
		<ul data-role="listview" data-filter="true">
      <% clients.each(function(client){ %>
			<li><a href="#client-<%=client.id %>"><%=client.get('first_name') + " " + client.get('last_name') %></a></li>
      <% }); %>
    </ul>
    ''')
    @render()
  render: =>
    @el = @activePage()
    @el.find('.ui-content').html(@template({clients: Clients}))
    @reapplyStyles(@el)

class ClientView extends OutbackView
  constructor: (client) ->
    super
    @template = _.template('''
    <h2><%=client.get('first_name') + ' ' + client.get('last_name') %> (<%=client.get('jsid')%>)</h2>
    <div class="ui-grid-a">
    <div class="ui-block-a"><strong>Mobile:</strong> <a href="tel:<%=client.get('phone_home')%>"><%=client.get('phone_home')%></a></div>
    <div class="ui-block-b"><strong>Home:</strong> <a href="tel:<%=client.get('phone_mobile')%>"><%=client.get('phone_mobile')%></a></div>
    </div>
    <p><strong>Email:</strong> <a href="mailto:<%=client.get('email')%>"><%=client.get('email')%></a></p>
    <p>10/22 Saxon St Brunswick 3036 VIC</a></p>
		<div data-role="collapsible">
    <h3>Client Details</h3>
    </div>
    ''')
    @render(client)
  render: (client) =>
    @el = @activePage()
    @el.find('.ui-content').html(@template({client: client}))
    @reapplyStyles(@el)

class PinView extends OutbackView
  constructor: (client) ->
    super
    @template = _.template('''
    <p>
    Select a PIN to secure client data locally
    </p>
    <div class="ui-grid-h">
    <div class="ui-block-a"><strong>Mobile:</strong> <a href="tel:<%=client.get('phone_home')%>"><%=client.get('phone_home')%></a></div>
    <div class="ui-block-b"><strong>Home:</strong> <a href="tel:<%=client.get('phone_mobile')%>"><%=client.get('phone_mobile')%></a></div>
    <div class="ui-block-c"><strong>Home:</strong> <a href="tel:<%=client.get('phone_mobile')%>"><%=client.get('phone_mobile')%></a></div>
    ''')
    @render(client)
  render: (client) =>
    @el = @activePage()
    @el.find('.ui-content').html(@template({client: client}))
    @reapplyStyles(@el)

# ## Controllers
class OutbackController extends Backbone.Controller
  routes :
    "home"  : "home"
    "sync&ui-state=dialog"  : "login"
    "sync"  : "sync"
    "caseload"  : "caseload"
    "client-:id"  : "client"
  constructor: ->
    super
    @_views = {}
  home : ->
    @_views['home'] ||= new HomeView
  sync : ->
    @_views['sync'] ||= new SyncView
  login : ->
    @_views['login'] ||= new LoginView
  caseload : ->
    @_views['caseload'] ||= new CaseloadView
  client : (id) ->
    @_views['client'] ||= new ClientView(Clients.get(id))
this.outbackController = new OutbackController

# Start the app
$(document).ready ->
  # controller must be instantiated before history can be started
  Clients.fetch success: ->
    Backbone.history.start()
    outbackController.home()
