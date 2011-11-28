(function() {
  var LocalStoreView;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  LocalStoreView = (function() {

    __extends(LocalStoreView, OutbackView);

    function LocalStoreView() {
      LocalStoreView.__super__.constructor.apply(this, arguments);
      this.template = _.template('<form action="#passphrase" method="post">\n  <p>Enter a passphrase to secure Outback. Do <strong>not</strong> use your Bridge or ESS password!</p>\n  <div data-role="fieldcontain">\n    <label for="pin">Password</label>\n    <input type="password" value="" name="pin" id="pin"/>\n  </div>\n  <div data-role="fieldcontain">\n    <label for="pin_confirmation">Confirm Password</label>\n    <input type="password" value="" name="pin_confirmation" id="pin_confirmation"/>\n  </div>\n  <div class="ui-grid-a">\n  <div class="ui-block-a">\n    <a data-role="button" href="#" data-theme="c" data-rel="back">Cancel</a>\n  </div>\n  <div class="ui-block-b">\n    <button data-theme="b" data-role="button" type="submit" name="submit" value="submit-value">Submit</button>\n  </div>\n  </div>\n</form>');
      this.render();
    }

    LocalStoreView.prototype.events = {
      "submit form": "onSubmit"
    };

    LocalStoreView.prototype.render = function() {
      this.el = this.activePage();
      this.el.find('h1').html('Outback Passphrase');
      this.el.find('.ui-content').html(this.template());
      this.reapplyStyles(this.el);
      return this.delegateEvents();
    };

    LocalStoreView.prototype.onSubmit = function(e) {
      $.mobile.pageLoading();
      e.preventDefault();
      return e.stopPropagation();
    };

    return LocalStoreView;

  })();

  this.LocalStoreView = LocalStoreView;

}).call(this);
