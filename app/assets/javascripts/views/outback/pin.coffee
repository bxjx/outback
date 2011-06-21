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
