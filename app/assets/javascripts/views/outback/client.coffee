class ClientView extends OutbackView
  constructor: (client) ->
    super
    # hmmm.. could this go wrong if update on model comes while not looking at
    # the view for this client?
    client.bind 'change', (changed_client) =>
      @render(changed_client)
    @template = _.template('''
    <h2><%=client.get('first_name') + ' ' + client.get('last_name') %> (<%=client.get('jsid')%>)</h2>
    <div class="ui-grid-a">
    <div class="ui-block-a"><strong>Mobile:</strong> <a href="tel:<%=client.get('phone_home')%>"><%=client.get('phone_home')%></a></div>
    <div class="ui-block-b"><strong>Home:</strong> <a href="tel:<%=client.get('phone_mobile')%>"><%=client.get('phone_mobile')%></a></div>
    </div>
    <p><strong>Email:</strong> <a href="mailto:<%=client.get('email')%>"><%=client.get('email')%></a></p>
    <p><%=client.get('residential_address')%> <%=client.get('residential_suburb')%> <%=client.get('residential_state')%> <%=client.get('residential_postcode')%></a></p>
		<div data-role="collapsible">
    <h3>Client Details</h3>
    <div class="ui-grid-a">
    <div class="ui-block-a"><strong>Stream:</strong> <%=client.get('stream_summary')%></div>
    <div class="ui-block-b"><strong>Participation:</strong> <%=client.get('activity_tested?') ? 'required' : 'not required'%></div>
    </div>
    </div>
		<div data-role="collapsible">
    <h3>Contacts</h3>
      <a href="#clients-<%=client.id%>" data-rel="dialog" data-transition="flip" data-role="button">New Contact</a>
      <ul data-role="listview" data-inset="true">
        <% var _view = this; %>
        <% _(client.get('contacts')).each(function(contact){ %>
        <li>
        <abbrev title="<%=_view.formattedDate(contact.created_at)%>" class="timeago ui-li-aside"></abbrev>
        <% if (!contact.synced){ %>
          <em>(Unsynced)</em>
        <% } %>
        <%=contact.user_name%>: 
        <%=contact.notes%>
        </li>
        <% }); %>
      </ul>
    </div>
    ''')
    @render(client)
  render: (client) =>
    @el = @activePage()
    @el.find('.ui-content').html(@template({client: client}))
    $("abbrev.timeago").timeago()
    @reapplyStyles(@el)
  formattedDate: (date) ->
    if /Z$/.test(date) then date else @isoDate(date)


this.ClientView = ClientView
