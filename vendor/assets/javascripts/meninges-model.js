Backbone.MeningesModel = Backbone.Model.extend({

  constructor: function() {
    Backbone.Model.prototype.constructor.apply(this, arguments);
    this.replaceWithMeningesAttributes(this.attributes);
  },

  toJSON: function () {
    var o = Backbone.Model.prototype.toJSON.apply(this, arguments);
    var self = this;
    if (this.associations) {
      _(_(this.associations).keys()).each(function (key) {
        var obj = self.lookupConstructor(self.associations[key].model);
        if (obj !== undefined && o[key]) {
          o[key] = o[key].toJSON();
        }
      });
    }
    return o;
  },

  parse: function (attrs, xhr, isNested) {
    var attrsClone = _(attrs).clone();
    console.log("starting parse")
    this.replaceWithMeningesAttributes(attrs);
    if(isNested) {
      this.removeAttributesNotProvided(attrsClone);
    }
    return attrs;
  },

  removeAttributesNotProvided: function (attrs) {
    var keys = _(this.attributes).keys();
    var self = this;
    _(keys).each(function (key) {
      if(!attrs[key]) {
        self.unset(key);
      }
    });
  },

  replaceWithMeningesAttributes: function (attrs) {
    console.log("in repalce..");
    if (this.associations) {
      console.log("got assoc");
      var self = this;
      _(_(this.associations).keys()).each(function (key) {
        var obj = self.lookupConstructor(self.associations[key].model);
        console.log('constructor..');
        console.log(obj);
        if (obj !== undefined) {
          if(self.get(key) && self.get(key).set) {
            console.log("PARSING");
            self.get(key).set(self.get(key).parse(attrs[key], null, true));
            delete attrs[key];
          }
          else if(self.isKeyAnUpdatableCollection(self, key, attrs)) {
            console.log('pop from .. with ');
            console.log(attrs[key]);
            console.log(self.get(key));
            window.gotcha = obj;
            var updated_attrs = {}
            updated_attrs[key] = obj;
            self.set(updated_attrs);
            console.log("after set");
            console.log(self.get(key));
            console.log("after get");
            self.populateCollectionFromArray(attrs[key], self.get(key));
            console.log('post..');
            console.log(self.get(key));
            delete attrs[key];
          }
          else if(attrs && attrs[key]) {
            attrs[key] = new obj(attrs[key]);
          }
        }
      });
    }
  },

  isKeyAnUpdatableCollection: function (model, key, attrs) {
    // Remvoed test for refresh --B.J.
    return model.get(key) && attrs && attrs[key]
  },

  populateCollectionFromArray: function (els, collection) {
    var modelsToRemove = [];
    var indexesToRemove= [];
    console.log("in pop...");
    console.log(collection);
    console.log('did colleciton');
    collection.each(function (model) {
      console.log("in collection with loop with");
      console.log(model);
      var matched = false;
      _(els).each(function (el, index) {
        console.log("in inner");
        if(model.equals && model.equals(el)) {
          console.log("equals");
          model.set(model.parse(el, null, true));
          matched = true;
          indexesToRemove.push(index);
        }
      });
      if(!matched) {
        console.log("no match");
        modelsToRemove.push(model);
        console.log("after match");
      }
    });
    console.log("past here");

    _(modelsToRemove).each(function (model) { collection.remove(model); });
    console.log("here3");
    _(indexesToRemove).each(function (index) { delete els[index]; });
    console.log("here4");

    console.log("state of els");
    console.log(els);
    _(els).each(function (el) {
      if(el) {
        console.log("about to adding something");
        collection.add(new collection.model(el));
        console.log("adding something");
        console.log(el);
        console.log(collection);
      }
    });
  },

  lookupConstructor: function (classPath) {
    var obj = window;
    _(classPath.split(".")).each(function(pathElement) {
      console.log("split with " + pathElement);
      obj = obj[pathElement];
    });
    return obj;
  }
});
