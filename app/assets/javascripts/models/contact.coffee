# Models a basic client contact
class Contact extends Backbone.Model
  sync: Backbone.localSync
  initialize: (attrs, options) ->
    @created_at = Date.new()
  validate: (attrs) ->
    console.log("validating..")
    if attrs.notes is ""
      "Notes must be entered"

class ContactCollection extends Backbone.Collection
  localStorage: new Store("contacts")
  sync: Backbone.localSync
  model: Contact

this.Contacts = new ContactCollection
