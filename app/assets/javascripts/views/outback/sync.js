(function() {
  var SyncView;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  SyncView = (function() {
    __extends(SyncView, OutbackView);
    function SyncView() {
      this.render = __bind(this.render, this);      SyncView.__super__.constructor.apply(this, arguments);
      this.template = _.template('<% if (Users.currentUser && Users.currentUser.syncing){ %>\n<a data-role="button" data-theme="b" id="#cancel">Cancel Sync</a>\n<% }else{ %>\n<a href="#login" data-rel="dialog" data-transition="flip" data-role="button" data-icon="refresh">Sync with Bridge</a>\n<% }%>\n\n<% if (Users.currentUser && Users.currentUser.lastSyncStarted){ %>\n  <ul id="sync-status" data-role="listview">\n    <li id="sync_step_authenticate">Authenticate with Bridge <span id="error-info"></span><span class="ui-icon status complete"></status></li>\n    <li id="sync_step_caseload">Sync Caseload<span class="ui-icon status <%= Users.currentUser.lastSync ? \'complete\' : \'loading\'%>"></status></li>\n    <% if (Users.currentUser && Users.currentUser.lastSyncStatus){ %>\n    <li>Last sync successfully completed <abbrev class="timeago" title="<%=this.isoDate(Users.currentUser.lastSync)%>"></abbrev</li>\n    <% } %>\n  </ul>\n<% } %>');
      Users.bind('auth:authenticated', __bind(function(user) {
        $('.ui-dialog').dialog('close');
        return this.render();
      }, this));
      Clients.bind('clients:synced', __bind(function() {
        this.render();
        return this.announce("Sync successfull completed");
      }, this));
      Users.bind('auth:unauthorised', __bind(function() {
        return this.authStepFailed('unauthorised');
      }, this));
      Users.bind('auth:timeout', __bind(function() {
        return this.authStepFailed('timeout');
      }, this));
      Users.bind('auth:error:bridge', __bind(function() {
        return this.authStepFailed('server error');
      }, this));
      Users.bind('auth:error', __bind(function() {
        return this.authStepFailed('error');
      }, this));
      this.render();
    }
    SyncView.prototype.authStepFailed = function(message) {
      $('#sync_step_authenticate').removeClass('complete').addClass('failed');
      return $('#sync_step_authenticate #error-info').text("Error: " + message);
    };
    SyncView.prototype.render = function() {
      this.el = $('#sync');
      this.el.find('h1').html('Sync with Bridge');
      this.el.find('.ui-content').html(this.template());
      $("abbrev.timeago").timeago();
      return this.reapplyStyles(this.el);
    };
    return SyncView;
  })();
}).call(this);
