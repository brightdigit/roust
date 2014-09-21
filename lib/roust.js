var express = require('express');
var fs = require('fs');
var path = require('path');
var routemanager = require('./routemanager.js');
var actionmap = require('./actionmap.json');
var funcparams = require('./funcparams.js');
var objectcache = require('./objectcache.js');
var configuration = require('./configuration.js');
module.exports = function () {
  var Roust = function (configuration) {
    console.log(configuration);
    this.configuration = configuration;
  };

  Roust.functype = function (func) {
    var params = funcparams(func);
    if (params.length === 0 || params[0] === 'include') {
      return 'controller';
    } else if (params[0] === 'save') {
      return 'include';
    }
  };

  Roust.push = function (objects) {
    return Roust._push.bind(undefined, objects);
  };

  Roust._push = function (objects, file) {
    var controller;
    try {
      controller = require(file);
    }
    catch (ex) {
      console.log(ex);
    }
    if (typeof controller === 'function') {
      if (Roust.functype(controller) === 'include') {
        objects.includes.push(controller);
      } else if (Roust.functype(controller) === 'controller') {
        objects.controllers.push(controller);
      }
    }
  };

  Roust.prototype = {
    parse: function (files) {
      var objects = {
        controllers: [],
        includes: []
      };
      files.forEach(Roust.push(objects));
      return objects;
    },
    objectcache: function (includes) {
      var builder = objectcache();
      for (var i = 0; i < includes.length; i++) {
        includes[i](builder.save());
      };
      return builder();
    },
    route: function (router, controllers, include, am, rm) {
      var am = am || actionmap;
      var rm = rm || routemanager;
      for (var i = 0; i < controllers.length; i++) {
        var resources = controllers[i](include);
        for (var resource in resources) {
          var routes = rm(resource, router);

          for (var action in resources[resource].actions) {
            console.log(am[action]);
            console.log(resources[resource].actions[action]);
            routes(am[action], resources[resource].actions[action]);
          }
        }
      }
      return router;
    },
    router: function (exp) {
      express = exp || express;
      var objects = this.parse(this.configuration.files);
      var oc = this.objectcache(objects.includes);
      console.log(objects);
      var router = this.route(express.Router(), objects.controllers, oc);
      return router;
    },
    apply: function (app, router) {
      var useArgs = this.configuration.base ? [this.configuration.base, router] : [router];
      app.use.apply(app, useArgs);
    }
  };
  var app = this.use ? this : arguments[0];
  var config = configuration(arguments);
  var rst = new Roust(config);
  var router = rst.router();
  rst.apply(app, router);
};

express.application.roust = module.exports;