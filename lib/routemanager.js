module.exports = function () {
  var routeManager = function (resource, router) {
    var base = '/' + resource;
    console.log(base);

    this.routes = [router.route(base), router.route(base + '/:id')];
  };

  routeManager.prototype = {
    route: function (id) {
      return this.routes[id ? 1 : 0];
    },
    add: function (actionSpecs, func) {
      console.log(actionSpecs);
      var params = !Array.isArray(func) ? [func] : func;
      this.route(actionSpecs.id)[actionSpecs.verb].call(this.route(actionSpecs.id),params);
    }
  };

  return function (resource, router) {
    var routes = new routeManager(resource, router);
    return routes.add.bind(routes);
  };
}();