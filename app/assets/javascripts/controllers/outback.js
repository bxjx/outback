(function() {
  var OutbackController;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  OutbackController = (function() {
    __extends(OutbackController, Backbone.Controller);
    OutbackController.prototype.routes = {
      "home": "home",
      "sync&ui-state=dialog": "login",
      "sync": "sync",
      "caseload": "caseload",
      "client-:id": "client"
    };
    function OutbackController() {
      OutbackController.__super__.constructor.apply(this, arguments);
      this._views = {};
    }
    OutbackController.prototype.home = function() {
      var _base;
      return (_base = this._views)['home'] || (_base['home'] = new HomeView);
    };
    OutbackController.prototype.sync = function() {
      var _base;
      return (_base = this._views)['sync'] || (_base['sync'] = new SyncView);
    };
    OutbackController.prototype.login = function() {
      var _base;
      return (_base = this._views)['login'] || (_base['login'] = new LoginView);
    };
    OutbackController.prototype.caseload = function() {
      var _base;
      return (_base = this._views)['caseload'] || (_base['caseload'] = new CaseloadView);
    };
    OutbackController.prototype.client = function(id) {
      var _base;
      return (_base = this._views)['client'] || (_base['client'] = new ClientView(Clients.get(id)));
    };
    return OutbackController;
  })();
  this.outbackController = new OutbackController;
}).call(this);
