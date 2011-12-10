(function() {
  var SyncView;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  SyncView = (function() {

    __extends(SyncView, OutbackView);

    function SyncView() {
      this.render = __bind(this.render, this);      SyncView.__super__.constructor.apply(this, arguments);
      this.page = 'sync';
      this.testIfOnline();
      this.bindForAuthEvents();
      this.template = _.template('<% if (Users.currentUser && Users.currentUser.syncing){ %>\n  <a data-role="button" data-theme="b" id="#cancel">Cancel Sync</a>\n<% }else{ %>\n  <% if (!this.onlineStatusKnown){ %>\n    <ul id="sync-status" data-role="listview">\n      <li>Testing if online...<span class="ui-icon status loading"></span></li>\n    </ul>\n  <% }else{ %>\n    <% if (!this.online){ %>\n      <p id="offline_warning"><strong>You do not appear to be online! If you are sure you are, you can attempt to start syncing.</strong></p>\n    <% } %>\n    <a href="#login" data-rel="dialog" data-transition="flip" data-role="button" data-icon="refresh">Start Sync</a>\n  <% }%>\n<% }%>\n\n<% if (Users.currentUser && Users.currentUser.lastSyncStarted){ %>\n  <ul id="sync-status" data-role="listview">\n    <li id="sync_step_authenticate">Authenticate with Bridge <span id="error-info"></span><span class="ui-icon status complete"></span></li>\n    <li id="sync_step_caseload">Sync Caseload<span class="ui-icon status <%= Users.currentUser.lastSync ? \'complete\' : \'loading\'%>"></span></li>\n    <% if (Users.currentUser && Users.currentUser.lastSyncStatus){ %>\n    <li>Last sync successfully completed <abbrev class="timeago" title="<%=this.isoDate(Users.currentUser.lastSync)%>"></abbrev</li>\n    <% } %>\n  </ul>\n<% } %>');
      this.render();
    }

    SyncView.prototype.render = function() {
      this.el = $('#sync');
      this.el.find('h1').html('Sync with Bridge');
      this.el.find('.ui-content').html(this.template());
      $("abbrev.timeago").timeago();
      return this.reapplyStyles(this.el);
    };

    SyncView.prototype.bindForAuthEvents = function() {
      var _this = this;
      Users.bind('auth:authenticated', function(user) {
        $('.ui-dialog').dialog('close');
        return _this.render();
      });
      Clients.bind('clients:synced', function() {
        _this.render();
        return _this.announce("Sync successfull completed");
      });
      Users.bind('auth:unauthorised', function() {
        return _this.authStepFailed('unauthorised');
      });
      Users.bind('auth:timeout', function() {
        return _this.authStepFailed('timeout');
      });
      Users.bind('auth:error:bridge', function() {
        return _this.authStepFailed('server error');
      });
      return Users.bind('auth:error', function() {
        return _this.authStepFailed('error');
      });
    };

    SyncView.prototype.authStepFailed = function(message) {
      $('#sync_step_authenticate').removeClass('complete').addClass('failed');
      return $('#sync_step_authenticate #error-info').text("Error: " + message);
    };

    SyncView.prototype.testIfOnline = function() {
      var _this = this;
      this.onlineStatusKnown = false;
      this.online = false;
      Users.bind('outback:offline', function() {
        _this.onlineStatusKnown = true;
        _this.online = false;
        return _this.render();
      });
      Users.bind('outback:online', function() {
        _this.onlineStatusKnown = true;
        _this.online = true;
        return _this.render();
      });
      return Users.testIfOnline();
    };

    return SyncView;

  })();

  this.SyncView = SyncView;

}).call(this);
