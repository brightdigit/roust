module.exports = function (fn) {
  var funStr = fn.toString && fn.toString();
  return typeof fn === 'function' ? 
    funStr.slice(funStr.indexOf('(') + 1, funStr.indexOf(')')).match(/([^\s,]+)/g) :
    undefined;
};