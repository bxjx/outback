(function() {
  var ContactFormView;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  ContactFormView = (function() {
    __extends(ContactFormView, OutbackView);
    function ContactFormView(client) {
      ContactFormView.__super__.constructor.apply(this, arguments);
      this.client = client;
      this.template = _.template('<form action="#clients-<%=client.id%>" method="post">\n  <div data-role="fieldcontain">\n    <label for="notes">Notes</label><textarea name="notes" id="notes"></textarea>\n  </div>\n  <div class="ui-grid-a">\n    <div class="ui-block-a"><a data-role="button" href="#" data-theme="c" data-rel="back">Cancel</a></div>\n    <div class="ui-block-b"><button data-theme="b" data-role="button" type="submit" name="submit" value="submit-value">Save</button></div>\n  </div>\n</form>');
      this.render();
    }
    ContactFormView.prototype.events = {
      "submit form": "onSubmit"
    };
    ContactFormView.prototype.render = function() {
      this.el = this.activePage();
      this.el.find('h1').html('Contact Form');
      this.el.find('.ui-content').html(this.template({
        'client': this.client
      }));
      this.$("#notes").val('');
      this.reapplyStyles(this.el);
      return this.delegateEvents();
    };
    ContactFormView.prototype.onSubmit = function(e) {
      var callbacks, contacts;
      e.preventDefault();
      e.stopPropagation();
      $.mobile.pageLoading();
      callbacks = {
        success: __bind(function(saved_contact, attrs) {
          return $('.ui-dialog').dialog('close');
        }, this),
        error: __bind(function() {
          $('.ui-dialog').dialog('close');
          return this.announce(error);
        }, this)
      };
      contacts = this.client.get('contacts');
      contacts.unshift({
        'notes': this.$('#notes').val(),
        'created_at': new Date()
      });
      this.client.save({
        'contacts': contacts
      }, callbacks);
      return this.client.change();
    };
    return ContactFormView;
  })();
  this.ContactFormView = ContactFormView;
}).call(this);
