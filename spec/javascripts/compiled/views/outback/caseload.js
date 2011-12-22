(function() {
  var CaseloadView;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  CaseloadView = (function() {
    __extends(CaseloadView, OutbackView);
    function CaseloadView() {
      this.render = __bind(this.render, this);      CaseloadView.__super__.constructor.apply(this, arguments);
      this.page = 'caseload';
      this.cached_html = null;
      Clients.bind('clients:synced', __bind(function() {
        return this.cached_html = null;
      }, this));
      this.template = _.template('<ul data-role="listview" data-filter="true">\n      <% clients.each(function(client){ %>\n	<li><a href="#client-<%=client.id %>"><%=_.escape(client.get(\'first_name\')) + " " + _.escape(client.get(\'last_name\')) %> - <%=client.get(\'jsid\')%></a></li>\n      <% }); %>\n    </ul>');
    }
    CaseloadView.prototype.render = function() {
      this.el = this.activePage();
      if (!this.cached_html) {
        this.cached_html = this.template({
          clients: Clients
        });
        this.el.find('.ui-content').html(this.cached_html);
      }
      return this.reapplyStyles(this.el);
    };
    return CaseloadView;
  })();
  this.CaseloadView = CaseloadView;
}).call(this);
