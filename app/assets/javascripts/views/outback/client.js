(function() {
  var ClientView;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ClientView = (function() {
    __extends(ClientView, OutbackView);
    function ClientView(client) {
      this.render = __bind(this.render, this);      ClientView.__super__.constructor.apply(this, arguments);
      this.template = _.template('    <h2><%=client.get(\'first_name\') + \' \' + client.get(\'last_name\') %> (<%=client.get(\'jsid\')%>)</h2>\n    <div class="ui-grid-a">\n    <div class="ui-block-a"><strong>Mobile:</strong> <a href="tel:<%=client.get(\'phone_home\')%>"><%=client.get(\'phone_home\')%></a></div>\n    <div class="ui-block-b"><strong>Home:</strong> <a href="tel:<%=client.get(\'phone_mobile\')%>"><%=client.get(\'phone_mobile\')%></a></div>\n    </div>\n    <p><strong>Email:</strong> <a href="mailto:<%=client.get(\'email\')%>"><%=client.get(\'email\')%></a></p>\n    <p>10/22 Saxon St Brunswick 3036 VIC</a></p>\n<div data-role="collapsible">\n    <h3>Client Details</h3>\n    </div>');
      this.render(client);
    }
    ClientView.prototype.render = function(client) {
      this.el = this.activePage();
      this.el.find('.ui-content').html(this.template({
        client: client
      }));
      return this.reapplyStyles(this.el);
    };
    return ClientView;
  })();
  this.ClientView = ClientView;
}).call(this);
