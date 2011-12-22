(function() {
  var BridgeSync;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  BridgeSync = (function() {
    __extends(BridgeSync, Backbone.Model);
    function BridgeSync() {
      BridgeSync.__super__.constructor.apply(this, arguments);
    }
    BridgeSync.prototype.sync = Backbone.localSync;
    return BridgeSync;
  })();
  this.sync = new BridgeSync;
}).call(this);
