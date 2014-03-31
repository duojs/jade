/**
 * Module Dependencies
 */

var fs = require('co-fs');
var jade = require('jade');
var filepath = require.resolve('jade/runtime.js');

/**
 * Export `transform`
 */

module.exports = transform;

/**
 * Initialize `transform`
 *
 * @param {Object} opts
 * @return {*function} fn
 * @api public
 */

function transform(opts) {
  opts = opts || {};
  var first = true;

  return function *(src, json, builder) {
    if (first) {
      var runtime = yield fs.readFile(filepath, 'utf8');
      builder.include('jade-runtime', runtime);
    }

    // add in the file name
    opts.filename = json.id;

    return 'var jade = require(\'jade-runtime\');\n\n' +
           'module.exports = ' + jade.compileClient(src, opts) + ';';

    first = false;
  }
}
