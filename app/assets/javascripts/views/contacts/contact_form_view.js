(function() {
  var ContactFormView;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

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
      this.delegateEvents();
      return this.$("#notes").focus();
    };

    ContactFormView.prototype.onSubmit = function(e) {
      var callbacks;
      var _this = this;
      e.preventDefault();
      e.stopPropagation();
      $.mobile.pageLoading();
      callbacks = {
        success: function(saved_contact, attrs) {
          return $('.ui-dialog').dialog('close');
        },
        error: function() {
          $('.ui-dialog').dialog('close');
          return _this.announce(error);
        }
      };
      return this.client.add_contact(this.$('#notes').val(), callbacks);
    };

    return ContactFormView;

  })();

  this.ContactFormView = ContactFormView;

}).call(this);
