(function() {
  var Contact, ContactCollection;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Contact = (function() {
    __extends(Contact, Backbone.Model);
    function Contact() {
      Contact.__super__.constructor.apply(this, arguments);
    }
    Contact.prototype.sync = Backbone.localSync;
    Contact.prototype.initialize = function(attrs, options) {};
    Contact.prototype.validate = function(attrs) {
      if (attrs.notes === "") {
        return "Notes must be entered";
      }
    };
    return Contact;
  })();
  ContactCollection = (function() {
    __extends(ContactCollection, Backbone.Collection);
    function ContactCollection() {
      ContactCollection.__super__.constructor.apply(this, arguments);
    }
    ContactCollection.prototype.localStorage = new Store("contacts");
    ContactCollection.prototype.sync = Backbone.localSync;
    ContactCollection.prototype.model = Contact;
    return ContactCollection;
  })();
  this.Contacts = new ContactCollection;
}).call(this);
