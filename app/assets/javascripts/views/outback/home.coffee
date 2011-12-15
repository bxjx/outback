class HomeView extends OutbackView
  constructor: ->
    super
    @page = 'home'
    Users.bind 'outback:lock:success', =>
      @render()
    @template = _.template('''
    <ul data-role="listview" data-inset="true">
      <li data-role="list-divider">Account and Sync</li>
      <% if (Users.unlocked()){ %>
        <li><a href="#sync">Sync with Bridge</a></li>
        <li><a href="#lock">Lock</a></li>
        <li><a href="#reset">Reset</a></li>
        <li data-role="list-divider">Caseload</li>
        <li><a href="#caseload">Caseload</a></li>
      <% }else if (Users.secured()){ %>
        <li><a href="#unlock">Unlock</a></li>
        <li><a href="#reset">Reset</a></li>
      <% }else{ %>
        <li><a href="#secure">Create password</a></li>
      <% } %>
      <li><a href="#help">Help</a></li>
    </ul>
    ''')
    @render()
  render: =>
    @el = @activePage()
    @el.find('.ui-content').html(@template())
    @reapplyStyles(@el)

this.HomeView = HomeView
