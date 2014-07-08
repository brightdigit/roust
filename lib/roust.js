var express = require('express');
var application = express.application.prototype;
var fs = require('fs');
var path = require('path');
var routemanager = require('./routemanager.js');
var actionmap = require('./actionmap.json');
var funcparams = require('./funcparams.js');
var objectcache = require('./objectcache.js');
module.exports = function () {
  var Roust = function (router) {
    this._router = router;
    this._controllers = [];
    this._includes = [];
  };

  Roust.functype = function (func) {
    var params = funcparams(func);
    if (params.length === 0 || params[0] === 'include') {
      return 'controller';
    } else if (params[0] === 'save') {
      return 'include';
    }
  }
/*
  Roust.includes = function () {

  };

  Roust.includes.prototype = {
    push: function () {

    },
    include: function (name) {

    },
    compile: function () {
      return this.include.bind(this);
    }
  };
*/
  Roust.prototype = {
    controller: function (configuration) {
      this._controllers.push(configuration);
    },
    include: function (configuration) {
      this._includes.push(configuration);
    },
    router: function () {
      var include, builder = objectcache();
      for (var i = 0; i < this._includes.length; i++) {
        console.log(builder);
        console.log(this._includes[i]);
        this._includes[i](builder.save());
      };
      include = builder();
      for (var i = 0; i < this._controllers.length; i++) {
        var controllers = this._controllers[i](include);
        for (var resource in controllers) {
          var routes = routemanager(resource, this._router);
          for (var action in controllers[resource].actions) {
            routes(actionmap[action], controllers[resource].actions[action]);
          }
        }
      }
      return this._router;
    }
  };

  var args = Array.prototype.slice.call(arguments);
  if (this.use) {
    args.unshift(this);
  }
  //console.log(args);
  var app = args[0],
      basePath = args.length > 2 ? args[1] : undefined,
      directories = args.length > 2 ? args[2] : args[1];

  var rst = new Roust(express.Router());
  //console.log(app);
  //console.log(basePath);
  //console.log(directory);
  directories = typeof directories === 'string' ? [directories] : directories;
  directories.reduce(function (r, _) {
    return r.concat(fs.readdirSync(_).map(function (f) { return _ + '/' + f; }));
  }, []).forEach(function (file) {
    //console.log(file);
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

  var router = rst.router();
  var useArgs = basePath ? [basePath, router] : [router];
  console.log(useArgs);
  app.use.apply(app, useArgs);
/*
  fs.readdirSync(directory).forEach(function (file) {

  });

  return function (req, res, next) {
    res.send('hello world');
  };
  */
};

express.application.roust = module.exports;