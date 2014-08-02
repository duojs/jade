/**
 * Module Dependencies
 */

var path = require.resolve('jade/runtime.js');
var Jade = require('jade');
var fs = require('co-fs');
var read = fs.readFile;

/**
 * Expose `plugin`
 */

module.exports = plugin;

/**
 * Jade plugin
 */

function plugin(opts) {
  opts = opts || {};
  var first = true;

  return function *jade(file) {
    if ('jade' != file.type) return;
    file.type = 'js';

    if (first) {
      var runtime = yield read(path, 'utf8');
      file.include('jade-runtime', runtime);
      first = false;
    }

    // add path for extends, includes, etc.
    opts.filename = file.path;

    file.src = 'var jade = require(\'jade-runtime\');\n\n' +
               'module.exports = ' + Jade.compileClient(file.src, opts) + ';';
  }
}
