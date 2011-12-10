class CaseloadView extends OutbackView
  constructor: ->
    super
    @page = 'caseload'
    @cached_html = null
    Clients.bind 'clients:synced', =>
      @cached_html = null
    @template = _.template('''
		<ul data-role="listview" data-filter="true">
      <% clients.each(function(client){ %>
			<li><a href="#client-<%=client.id %>"><%=client.get('first_name') + " " + client.get('last_name') %></a></li>
      <% }); %>
    </ul>
    ''')
  render: =>
    @el = @activePage()
    if not @cached_html
      @cached_html = @template({clients: Clients})
      @el.find('.ui-content').html(@cached_html)
    @reapplyStyles(@el)

this.CaseloadView = CaseloadView
