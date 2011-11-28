# Models a basic client contact
class Contact extends Backbone.Model
  sync: Backbone.localSync
  initialize: (attrs, options) ->
    #@set(@created_at = Date.new()
  validate: (attrs) ->
    if attrs.notes is ""
      "Notes must be entered"

class ContactCollection extends Backbone.Collection
  sync: Backbone.localSync
  model: Contact

this.Contacts = new ContactCollection
