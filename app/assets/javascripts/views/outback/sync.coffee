# Show the status of a Sync with Bridge
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
          <li id="sync_step_authenticate">Authenticate with Bridge <span id="error-info"></span><span class="ui-icon status complete"></status></li>
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
      @announce("Sync successfull completed")
    Users.bind 'auth:unauthorised', =>
      @authStepFailed('unauthorised')
    Users.bind 'auth:timeout', =>
      @authStepFailed('timeout')
    Users.bind 'auth:error:bridge', =>
      @authStepFailed('server error')
    Users.bind 'auth:error', =>
      @authStepFailed('error')
    @render()
  authStepFailed: (message) ->
    $('#sync_step_authenticate').removeClass('complete').addClass('failed')
    $('#sync_step_authenticate #error-info').text("Error: #{message}")
  render: =>
    @el = $('#sync')
    @el.find('h1').html('Sync with Bridge')
    @el.find('.ui-content').html(@template())
    $("abbrev.timeago").timeago()
    @reapplyStyles(@el)

this.SyncView = SyncView
