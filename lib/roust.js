var express = require('express');
var application = express.application.prototype;
var fs = require('fs');
var path = require('path');
module.exports = function () {

  var args = Array.prototype.slice.call(arguments);
  if (this.use) {
    args.unshift(this);
  }
  console.log(args);
  var app = args[0],
      basePath = args.length > 2 ? args[1] : undefined,
      directory = args.length > 2 ? args[2] : args[1];

  var router = express.Router();

  var useArgs = basePath ? [basePath, router] : [router];
  //console.log(app);
  //console.log(basePath);
  //console.log(directory);
  fs.readdirSync(directory).forEach(function (file) {
    console.log(file);
    var controller;
    try {
      controller = require(directory + '/' + file);
      console.log(controller);
    }
    catch (ex) {

    }

  });
  router.use('/bears', function (req, res, next) {
    res.send('hello world');
  });
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