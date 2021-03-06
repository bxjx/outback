(function() {
  var EditContact;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  EditContact = (function() {
    __extends(EditContact, OutbackView);
    function EditContact(client, contactUid) {
      EditContact.__super__.constructor.apply(this, arguments);
      this.client = client;
      this.client.bind('change', __bind(function(changed_client) {
        $.mobile.pageLoading(true);
        this.announce('Contact deleted');
        return this.redirectToBack();
      }, this));
      this.contactUid = contactUid;
      this.template = _.template('<form action="#delete-contact" method="post">\n  <p>Delete an unsynced contact</p>\n  <div class="ui-grid-a">\n  <div class="ui-block-a">\n    <a data-role="button" href="#" data-theme="c" data-rel="back">Cancel</a>\n  </div>\n  <div class="ui-block-b">\n    <button data-theme="b" data-role="button" type="submit" name="submit" value="submit-value">Delete</button>\n  </div>\n  </div>\n</form>');
      this.render();
    }
    EditContact.prototype.events = {
      "submit form": "onSubmit"
    };
    EditContact.prototype.render = function() {
      this.el = this.activePage();
      this.el.find('h1').html('Delete Contact');
      this.el.find('.ui-content').html(this.template());
      this.reapplyStyles(this.el);
      return this.delegateEvents();
    };
    EditContact.prototype.onSubmit = function(e) {
      e.preventDefault();
      e.stopPropagation();
      $.mobile.pageLoading();
      return this.client.remove_contact(this.contactUid);
    };
    return EditContact;
  })();
  this.EditContact = EditContact;
}).call(this);
