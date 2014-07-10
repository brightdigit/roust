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
    this.configuration = configuration;
    //this._includes = [];
    //this._configuration = configuration;
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
/*
  var args = Array.prototype.slice.call(arguments);
  if (this.use) {
    args.unshift(this);
  }
  //console.log(args);
  var app = args[0],
      basePath = args.length > 2 ? args[1] : undefined,
      directories = args.length > 2 ? args[2] : args[1];
  */
  var rst = new Roust(config); //express.Router());
  //directories = typeof directories === 'string' ? [directories] : directories;
/*
  directories.reduce(function (r, _) {
    return r.concat(fs.readdirSync(_).map(function (f) { return _ + '/' + f; }));
  }, []).forEach(function (file) {
    var controller;
    try {
      controller = require(file);
    }
    catch (ex) {
      console.log(ex);
    }
    if (typeof controller === 'function') {
      if (Roust.functype(controller) === 'include') {
        rst.include(controller);
      } else if (Roust.functype(controller) === 'controller') {
        rst.controller(controller);
      }
    }

  });
*/
  var router = rst.router();

  rst.apply(app, router);
  //var useArgs = basePath ? [basePath, router] : [router];
  //console.log(useArgs);
  //app.use.apply(app, useArgs);
/*
  fs.readdirSync(directory).forEach(function (file) {

  });

  return function (req, res, next) {
    res.send('hello world');
  };
  */
};

express.application.roust = module.exports;