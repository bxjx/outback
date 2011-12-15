(function() {
  var ClientView;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  ClientView = (function() {

    __extends(ClientView, OutbackView);

    function ClientView(client) {
      this.render = __bind(this.render, this);
      var _this = this;
      ClientView.__super__.constructor.apply(this, arguments);
      this.page = "client-" + client.id;
      client.bind('change', function(changed_client) {
        return _this.render(changed_client);
      });
      this.template = _.template('    <h2><%=client.get(\'first_name\') + \' \' + client.get(\'last_name\') %> (<%=client.get(\'jsid\')%>)</h2>\n    <div class="ui-grid-a">\n    <div class="ui-block-a"><strong>Mobile:</strong> <a href="tel:<%=client.get(\'phone_home\')%>"><%=client.get(\'phone_home\')%></a></div>\n    <div class="ui-block-b"><strong>Home:</strong> <a href="tel:<%=client.get(\'phone_mobile\')%>"><%=client.get(\'phone_mobile\')%></a></div>\n    </div>\n    <p><strong>Email:</strong> <a href="mailto:<%=client.get(\'email\')%>"><%=client.get(\'email\')%></a></p>\n    <p><%=client.get(\'residential_address\')%> <%=client.get(\'residential_suburb\')%> <%=client.get(\'residential_state\')%> <%=client.get(\'residential_postcode\')%></a></p>\n<div data-role="collapsible">\n    <h3>Client Details</h3>\n    <div class="ui-grid-a">\n    <div class="ui-block-a"><strong>Stream:</strong> <%=client.get(\'stream_summary\')%></div>\n    <div class="ui-block-b"><strong>Participation:</strong> <%=client.get(\'activity_tested?\') ? \'required\' : \'not required\'%></div>\n    </div>\n    </div>\n<div data-role="collapsible">\n    <h3>EPP</h3>\n    <div class="ui-grid-a">\n    <div class="ui-block-a"><strong>Last signed:</strong> 12/12/2011 3:13pm</div>\n    <div class="ui-block-b"><strong>Unsaved changes:</strong> yes</div>\n    </div>\n    <ul data-theme="c" data-role="listview" data-inset="true">\n      <li data-theme="c" data-role="list-divider">Activties</li>\n      <li>\n        <a href="#activity">\n        <p><strong>EM53 - Part-time or Casual Work (Employment)</strong></p>\n        <p>I agree to undertake 30 hours per fortnight of work from 5/12/2011 to 3/12/2012 and will report my earnings to Centrelink.</p>\n        </a>\n      </li>\n    </ul>\n    <ul data-role="listview" data-inset="true">\n      <li data-role="list-divider" data-theme="c" >Assistances</li>\n      <li>\n        <a href="#assistance">\n        <p><strong>AS13  Wage Subsidy Assistance</strong></p>\n        <p>Offer wage incentives for ongoing sustainable employment</p>\n        </a>\n      </li>\n    </ul>\n    <ul data-role="listview" data-inset="true">\n      <li data-theme="c" data-role="list-divider" >Barriers</li>\n      <li><p>None</p></li>\n    </ul>\n\n    <div class="ui-grid-a">\n    <div class="ui-block-a">\n    <a href="#new_activity" data-role="button">Add Activity, Assitance or Barrier</a>\n    </div>\n    <div class="ui-block-b">\n    <a href="#reset_epp" data-role="button">Reset</a>\n    </div>\n    <div class="ui-block-a">\n    <a href="#print_epp" data-role="button">Print</a>\n    </div>\n    <div class="ui-block-b">\n    <a href="#approve_epp" data-role="button">Mark as Signed</a>\n    </div>\n    </div>\n\n    </div>\n<div data-role="collapsible">\n    <h3>Contacts</h3>\n      <a href="#clients-<%=client.id%>" data-rel="dialog" data-transition="flip" data-role="button">New Contact</a>\n      <ul data-role="listview" data-inset="true">\n        <% var _view = this; %>\n        <% _(client.get(\'contacts\')).each(function(contact){ %>\n        <li>\n        <abbrev title="<%=_view.formattedDate(contact.created_at)%>" class="timeago ui-li-aside"></abbrev>\n        <% if (!contact.synced){ %>\n          <em>(Unsynced)</em>\n        <% } %>\n        <% if (contact.user_name){ %>\n          <%=contact.user_name%>: \n        <% } %>\n        <%=_.escape(contact.notes)%>\n        </li>\n        <% }); %>\n      </ul>\n    </div>');
      this.render(client);
    }

    ClientView.prototype.render = function(client) {
      this.el = this.activePage();
      this.el.find('.ui-content').html(this.template({
        client: client
      }));
      $("abbrev.timeago").timeago();
      return this.reapplyStyles(this.el);
    };

    ClientView.prototype.formattedDate = function(date) {
      if (/Z$/.test(date)) {
        return date;
      } else if (typeof date === 'string' && /\+/.test(date)) {
        return this.isoDate(new Date(date));
      } else {
        return this.isoDate(date);
      }
    };

    return ClientView;

  })();

  this.ClientView = ClientView;

}).call(this);
