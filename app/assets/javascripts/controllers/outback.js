(function() {
  var OutbackController;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  OutbackController = (function() {

    __extends(OutbackController, Backbone.Controller);

    OutbackController.prototype.routes = {
      "home": "home",
      "unlock": "unlock",
      "lock": "lock",
      "secure": "secure",
      "sync&ui-state=dialog": "login",
      "sync": "sync",
      "caseload": "caseload",
      "client-:id&ui-state=dialog": "contacts",
      "client-:id": "client"
    };

    function OutbackController() {
      OutbackController.__super__.constructor.apply(this, arguments);
      this._views = {};
    }

    OutbackController.prototype.home = function() {
      return this._views['home'] = new HomeView;
    };

    OutbackController.prototype.secure = function() {
      return this._views['secure'] = new SecureView;
    };

    OutbackController.prototype.unlock = function() {
      return this._views['unlock'] = new UnlockView;
    };

    OutbackController.prototype.lock = function() {
      return this._views['lock'] = new LockView;
    };

    OutbackController.prototype.sync = function() {
      return this._views['sync'] = new SyncView;
    };

    OutbackController.prototype.login = function() {
      return this._views['login'] = new LoginView;
    };

    OutbackController.prototype.caseload = function() {
      return this._views['caseload'] = new CaseloadView;
    };

    OutbackController.prototype.client = function(id) {
      return this._views['client'] = new ClientView(Clients.get(id));
    };

    OutbackController.prototype.contacts = function(id) {
      return this._views['contacts'] = new ContactFormView(Clients.get(id));
    };

    return OutbackController;

  })();

  this.outbackController = new OutbackController;

}).call(this);
