class ClientView extends OutbackView
  constructor: (client) ->
    super
    @page = "client-#{client.id}"
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
    <h3>EPP</h3>
    <div class="ui-grid-a">
    <div class="ui-block-a"><strong>Last signed:</strong> 12/12/2011 3:13pm</div>
    <div class="ui-block-b"><strong>Unsaved changes:</strong> yes</div>
    </div>
    <ul data-theme="c" data-role="listview" data-inset="true">
      <li data-theme="c" data-role="list-divider">Activties</li>
      <li>
        <a href="#activity">
        <p><strong>EM53 - Part-time or Casual Work (Employment)</strong></p>
        <p>I agree to undertake 30 hours per fortnight of work from 5/12/2011 to 3/12/2012 and will report my earnings to Centrelink.</p>
        </a>
      </li>
    </ul>
    <ul data-role="listview" data-inset="true">
      <li data-role="list-divider" data-theme="c" >Assistances</li>
      <li>
        <a href="#assistance">
        <p><strong>AS13  Wage Subsidy Assistance</strong></p>
        <p>Offer wage incentives for ongoing sustainable employment</p>
        </a>
      </li>
    </ul>
    <ul data-role="listview" data-inset="true">
      <li data-theme="c" data-role="list-divider" >Barriers</li>
      <li><p>None</p></li>
    </ul>

    <div class="ui-grid-a">
    <div class="ui-block-a">
    <a href="#new_activity" data-role="button">Add Activity, Assitance or Barrier</a>
    </div>
    <div class="ui-block-b">
    <a href="#reset_epp" data-role="button">Reset</a>
    </div>
    <div class="ui-block-a">
    <a href="#print_epp" data-role="button">Print</a>
    </div>
    <div class="ui-block-b">
    <a href="#approve_epp" data-role="button">Mark as Signed</a>
    </div>
    </div>

    </div>
		<div data-role="collapsible">
    <h3>Contacts</h3>
      <a href="#clients-<%=client.id%>" data-rel="dialog" data-transition="flip" data-role="button">New Contact</a>
      <ul data-role="listview" data-inset="true">
        <% var _view = this; %>
        <% _(client.get('contacts')).each(function(contact){ %>
        <li>
        <% if (!contact.synced){ %>
          <a href="#client-<%=client.id%>-edit-contact-<%=contact.uid%>">
        <% } %>
        <abbrev title="<%=_view.formattedDate(contact.created_at)%>" class="timeago ui-li-aside"></abbrev>
        <% if (!contact.synced){ %>
          <em>(Unsynced)</em>
        <% } %>
        <% if (contact.user_name){ %>
          <%=contact.user_name%>: 
        <% } %>
        <%=_.escape(contact.notes)%>
        <% if (!contact.synced){ %>
          </a>
        <% } %>
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
    if /Z$/.test(date) # iso
      date 
    else if typeof(date) == 'string' and /\+/.test(date) # gmt
      @isoDate(new Date(date))
    else
      @isoDate(date)


this.ClientView = ClientView
