var express = require('express');
var application = express.application.prototype;
var fs = require('fs');
var path = require('path');
var routemanager = require('./routemanager.js');
var actionmap = require('./actionmap.json');
module.exports = function () {
  var Roust = function (router) {
    console.log(router);
    this._router = router;
    this._controllers = [];
    this._includes = [];
  };

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

  Roust.prototype = {
    controller: function (configuration) {
      this._controllers.push(configuration);
    },
    include: function (func) {
      this._includes.push(func);
    },
    router: function () {
      var includes = new Roust.includes();
      var includeSet = includes.compile();
      for (var i = 0; i < this._controllers.length; i++) {
        var controllers = this._controllers[i](includeSet);
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
      directory = args.length > 2 ? args[2] : args[1];

  var rst = new Roust(express.Router());
  //console.log(app);
  //console.log(basePath);
  //console.log(directory);
  fs.readdirSync(directory).forEach(function (file) {
    //console.log(file);
    var controller;
    try {
      controller = require(directory + '/' + file);

    }
    catch (ex) {
      console.log(ex);
    }
    if (typeof controller === 'function') {

      rst.controller(controller);
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