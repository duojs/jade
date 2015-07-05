/**
 * Module Dependencies
 */

var Jade = require('jade');
var fs = require('co-fs');
var runtime = require.resolve('jade/runtime.js');

/**
 * Expose `plugin`
 */

module.exports = plugin;

/**
 * Jade plugin
 */

function plugin(opts) {
  opts = opts || {};

  return function *jade(file) {
    if (file.type !== 'jade') return;

    if (!file.included('jade-runtime')) {
      file.include('jade-runtime', yield fs.readFile(runtime, 'utf8'));
    }

    // add path for extends, includes, etc.
    opts.filename = file.path;

    var src = 'var jade = require(\'jade-runtime\');\n\n';
    src += 'module.exports = ' + Jade.compileClient(file.src, opts) + ';';

    file.type = 'js';
    file.src = src;
  };
}
