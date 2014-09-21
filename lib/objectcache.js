module.exports = function () {
  var builder = function () {
    this.objects = {};
  };

  builder.prototype = {
    objects: undefined,
    save: function () {
      return this.push.bind(this);
    },
    push: function (key, value) {
      console.log(key);
      if (key in this.objects) {
        if (!(this.objects[key].push)) {
          this.objects[key] = [this.objects[key]];
        }
        this.objects[key].push(value());
      } else {
        this.objects[key] = value();
      }
    },
    compile: function () {
      return this.include.bind(this);
    },
    include: function (key) {
      return this.objects[key];
    },
    builder: function () {
      var result = this.compile.bind(this);
      result.save = this.save.bind(this);
      return result;
    }
  };

  builder.begin = function () {
    var _ = new builder();
    return _.builder();
  };

  return builder.begin;
}();