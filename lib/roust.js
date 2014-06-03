module.exports = function () {
  return function (req, res, next) {
    res.send('hello world');
  };
};