class OutbackController extends Backbone.Controller
  routes :
    "home"  : "home"
    "home&ui-state=dialog"  : "localstore"
    "sync&ui-state=dialog"  : "login"
    "sync"  : "sync"
    "caseload"  : "caseload"
    "client-:id&ui-state=dialog"  : "contacts"
    "client-:id"  : "client"
  constructor: ->
    super
    @_views = {}
  home : ->
    @_views['home'] ||= new HomeView
  localstore : ->
    @_views['localstore'] ||= new LocalStoreView
  sync : ->
    @_views['sync'] ||= new SyncView
  login : ->
    @_views['login'] ||= new LoginView
  caseload : ->
    @_views['caseload'] = new CaseloadView
  client : (id) ->
    @_views['client'] = new ClientView(Clients.get(id))
  contacts : (id) ->
    @_views['contacts'] = new ContactFormView(Clients.get(id))
this.outbackController = new OutbackController
