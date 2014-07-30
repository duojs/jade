/**
 * Module Dependencies
 */

var path = require.resolve('jade/runtime.js');
var Jade = require('jade');
var fs = require('co-fs');
var read = fs.readFile;

/**
 * Expose `jade`
 */

module.exports = jade;

/**
 * Jade plugin
 */

function jade(opts) {
  opts = opts || {};
  var first = true;

  return function *jade(file, duo) {
    if ('jade' != file.type) return;
    file.type = 'js';

    if (first) {
      var runtime = yield read(path, 'utf8');
      duo.include('jade-runtime', runtime);
      first = false;
    }

    // add path for extends, includes, etc.
    opts.filename = file.path;

    file.src = 'var jade = require(\'jade-runtime\');\n\n' +
               'module.exports = ' + Jade.compileClient(file.src, opts) + ';';
  }
}
