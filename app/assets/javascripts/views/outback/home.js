(function() {
  var HomeView;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  HomeView = (function() {
    __extends(HomeView, OutbackView);
    function HomeView() {
      this.render = __bind(this.render, this);      HomeView.__super__.constructor.apply(this, arguments);
      this.template = _.template('<ul data-role="listview" data-inset="true">\n  <li data-role="list-divider">Caseload</li>\n  <li><a href="#caseload">Caseload</a></li>\n  <li data-role="list-divider">Account and Sync</li> <li><a href="#sync">Sync with Bridge</a></li>\n</ul>');
      this.render();
    }
    HomeView.prototype.render = function() {
      this.el = this.activePage();
      this.el.find('.ui-content').html(this.template());
      return this.reapplyStyles(this.el);
    };
    return HomeView;
  })();
}).call(this);
