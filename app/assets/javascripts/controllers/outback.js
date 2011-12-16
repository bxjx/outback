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
      "client-:id-edit-contact-:uid": "editContact",
      "client-:id&ui-state=dialog": "contacts",
      "client-:id": "client",
      "reset": "reset"
    };

    function OutbackController() {
      var _this = this;
      OutbackController.__super__.constructor.apply(this, arguments);
      this._views = {};
      this.bind('all', function() {
        return Users.logActivity();
      });
    }

    OutbackController.prototype.home = function() {
      return this._views['home'] = new HomeView;
    };

    OutbackController.prototype.secure = function() {
      var _base;
      return (_base = this._views)['secure'] || (_base['secure'] = new SecureView);
    };

    OutbackController.prototype.unlock = function() {
      var _base;
      return (_base = this._views)['unlock'] || (_base['unlock'] = new UnlockView);
    };

    OutbackController.prototype.lock = function() {
      var _base;
      return (_base = this._views)['lock'] || (_base['lock'] = new LockView);
    };

    OutbackController.prototype.sync = function() {
      return this._views['sync'] = new SyncView;
    };

    OutbackController.prototype.login = function() {
      return this._views['login'] = new LoginView;
    };

    OutbackController.prototype.caseload = function() {
      var _base;
      (_base = this._views)['caseload'] || (_base['caseload'] = new CaseloadView);
      return this._views['caseload'].render();
    };

    OutbackController.prototype.client = function(id) {
      return this._views['client'] = new ClientView(Clients.get(id));
    };

    OutbackController.prototype.contacts = function(id) {
      return this._views['contacts'] = new ContactFormView(Clients.get(id));
    };

    OutbackController.prototype.reset = function(id) {
      var _base;
      return (_base = this._views)['reset'] || (_base['reset'] = new ResetView);
    };

    OutbackController.prototype.editContact = function(id, contactUid) {
      return new EditContact(Clients.get(id), contactUid);
    };

    return OutbackController;

  })();

  this.outbackController = new OutbackController;

}).call(this);
