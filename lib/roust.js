var express = require('express');
var application = express.application.prototype;
module.exports = function () {
  var args = Array.prototype.concat.call(this.use ? [this] : [], arguments);

  var app = args[0],
      basePath = args.length > 2 ? args[1] : undefined,
      directory = args.length > 2 ? args[2] : args[1];

  var router = express.Router();

  var useArgs = basePath ? [basePath, router] : [router];

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