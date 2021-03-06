class OutbackController extends Backbone.Controller
  routes :
    "home"  : "home"
    "unlock"  : "unlock"
    "lock"  : "lock"
    "secure"  : "secure"
    "sync&ui-state=dialog"  : "login"
    "sync"  : "sync"
    "caseload"  : "caseload"
    "client-:id-edit-contact-:uid"  : "editContact"
    "client-:id&ui-state=dialog"  : "contacts"
    "client-:id"  : "client"
    "reset"  : "reset"
  constructor: ->
    super
    @_views = {}
    @bind 'all', =>
      Users.logActivity()
  home : ->
    @_views['home'] = new HomeView
  secure: ->
    @_views['secure'] ||= new SecureView
  unlock: ->
    @_views['unlock'] ||= new UnlockView
  lock: ->
    @_views['lock'] ||= new LockView
  sync : ->
    @_views['sync'] = new SyncView
  login : ->
    @_views['login'] = new LoginView
  caseload : ->
    @_views['caseload'] ||= new CaseloadView
    @_views['caseload'].render()
  client : (id) ->
    @_views['client'] = new ClientView(Clients.get(id))
  contacts : (id) ->
    @_views['contacts'] = new ContactFormView(Clients.get(id))
  reset : (id) ->
    @_views['reset'] ||= new ResetView
  editContact : (id, contactUid) ->
    new EditContact(Clients.get(id), contactUid)

this.outbackController = new OutbackController
