var fs = require('fs');
module.exports = function (args) {
  if (!args[0]) {
    throw new Error("no arguments supplied")
  }

  function files(directories) {
    directories = typeof directories === 'string' ? [directories] : directories;
    return directories.reduce(function (r, _) {
      return r.concat(fs.readdirSync(_).map(function (f) {
        return _ + '/' + f;
      }));
    }, []);
  }
  // console.log(args);
  args = args.shift ? args : Array.prototype.slice.call(args);
  if (args[0].use) {
    args.shift();
  }
  //console.log(args);
  //var app = args[0],
  return {
    base: args.length > 1 ? args[0] : undefined,
    files: files(args.length > 1 ? args[1] : args[0])
  }
};