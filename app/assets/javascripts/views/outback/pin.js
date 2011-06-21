(function() {
  var PinView;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  PinView = (function() {
    __extends(PinView, OutbackView);
    function PinView(client) {
      this.render = __bind(this.render, this);      PinView.__super__.constructor.apply(this, arguments);
      this.template = _.template('<p>\nSelect a PIN to secure client data locally\n</p>\n<div class="ui-grid-h">\n<div class="ui-block-a"><strong>Mobile:</strong> <a href="tel:<%=client.get(\'phone_home\')%>"><%=client.get(\'phone_home\')%></a></div>\n<div class="ui-block-b"><strong>Home:</strong> <a href="tel:<%=client.get(\'phone_mobile\')%>"><%=client.get(\'phone_mobile\')%></a></div>\n<div class="ui-block-c"><strong>Home:</strong> <a href="tel:<%=client.get(\'phone_mobile\')%>"><%=client.get(\'phone_mobile\')%></a></div>');
      this.render(client);
    }
    PinView.prototype.render = function(client) {
      this.el = this.activePage();
      this.el.find('.ui-content').html(this.template({
        client: client
      }));
      return this.reapplyStyles(this.el);
    };
    return PinView;
  })();
}).call(this);
