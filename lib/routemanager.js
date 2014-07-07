module.exports = function () {
  var routeManager = function (resource, router) {
    var base = '/' + resource;
    this.routes = [
    router.route(base), router.route(base + '/:id')];
  };

  routeManager.prototype = {
    route: function (id) {
      return this.routes[id ? 1 : 0];
    },
    add: function (actionSpecs, func) {
      this.route(actionSpecs.id)[actionSpecs.verb](func);
    }
  };

  return function (resource, router) {
    var routes = new routeManager(resource, router);
    return routes.add.bind(routes);
  };
}();