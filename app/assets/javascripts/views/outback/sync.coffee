# Show the status of a Sync with Bridge
class SyncView extends OutbackView

  constructor: ->
    super
    @testIfOnline()
    @bindForAuthEvents()
    @template = _.template('''
      <% if (Users.currentUser && Users.currentUser.syncing){ %>
        <a data-role="button" data-theme="b" id="#cancel">Cancel Sync</a>
      <% }else{ %>
        <% if (!this.onlineStatusKnown){ %>
          <ul id="sync-status" data-role="listview">
            <li>Testing if online...<span class="ui-icon status loading"></span></li>
          </ul>
        <% }else{ %>
          <% if (!this.online){ %>
            <p id="offline_warning"><strong>You do not appear to be online! If you are sure you are, you can attempt to start syncing.</strong></p>
          <% } %>
          <a href="#login" data-rel="dialog" data-transition="flip" data-role="button" data-icon="refresh">Start Sync</a>
        <% }%>
      <% }%>
      
      <% if (Users.currentUser && Users.currentUser.lastSyncStarted){ %>
        <ul id="sync-status" data-role="listview">
          <li id="sync_step_authenticate">Authenticate with Bridge <span id="error-info"></span><span class="ui-icon status complete"></span></li>
          <li id="sync_step_caseload">Sync Caseload<span class="ui-icon status <%= Users.currentUser.lastSync ? 'complete' : 'loading'%>"></span></li>
          <% if (Users.currentUser && Users.currentUser.lastSyncStatus){ %>
          <li>Last sync successfully completed <abbrev class="timeago" title="<%=this.isoDate(Users.currentUser.lastSync)%>"></abbrev</li>
          <% } %>
        </ul>
      <% } %>
    ''')
    @render()

  render: =>
    @el = $('#sync')
    @el.find('h1').html('Sync with Bridge')
    @el.find('.ui-content').html(@template())
    $("abbrev.timeago").timeago()
    @reapplyStyles(@el)

  bindForAuthEvents: ->
    Users.bind 'auth:authenticated', (user) =>
      $('.ui-dialog').dialog('close')
      @render()
    Clients.bind 'clients:synced', =>
      @render()
      @announce("Sync successfull completed")
    Users.bind 'auth:unauthorised', =>
      @authStepFailed('unauthorised')
    Users.bind 'auth:timeout', =>
      @authStepFailed('timeout')
    Users.bind 'auth:error:bridge', =>
      @authStepFailed('server error')
    Users.bind 'auth:error', =>
      @authStepFailed('error')

  authStepFailed: (message) ->
    $('#sync_step_authenticate').removeClass('complete').addClass('failed')
    $('#sync_step_authenticate #error-info').text("Error: #{message}")

  testIfOnline: ->
    @onlineStatusKnown = false
    @online = false
    Users.bind 'outback:offline', =>
      @onlineStatusKnown = true
      @online = false
      @render()
    Users.bind 'outback:online', =>
      @onlineStatusKnown = true
      @online = true
      @render()
    Users.testIfOnline()

this.SyncView = SyncView
