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
