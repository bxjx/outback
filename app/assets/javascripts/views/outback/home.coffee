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
