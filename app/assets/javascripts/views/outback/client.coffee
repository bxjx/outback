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

this.ClientView = ClientView
