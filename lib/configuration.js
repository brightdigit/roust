var fs = require('fs'),
    path =require('path');

module.exports = function (args) {
 function files(directories) {
    directories = typeof directories === 'string' ? [directories] : directories;
    return directories.reduce(function (r, _) {
      return r.concat(fs.readdirSync(_).reduce(function (a, f) {
        var fPath = path.join(_,f);
        var stats = fs.statSync(fPath);
        if (stats.isDirectory()) {
          a.push.apply(a,files(fPath));
        } else if (stats.isFile()) {
          a.push(fPath);
        }
        return a;
      }, []));
    }, []);
  }

  args = args.shift ? args : Array.prototype.slice.call(args);
  if (args[0].use) {
    args.shift();
  }

  return {
    base: args.length > 1 ? args[0] : undefined,
    files: files(args.length > 1 ? args[1] : args[0])
  }
};