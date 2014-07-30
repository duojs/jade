/**
 * Module Dependencies
 */

var Duo = require('duo');
var assert = require('assert');
var path = require('path');
var jade = require('..');
var vm = require('vm');
var join = path.join;

/**
 * Tests
 */

describe('duo-jade', function() {

  it('should transpile simple jade templates', function*() {
    var root = fixture('simple');
    var entry = join(root, 'index.js');
    var duo = Duo(root).use(jade()).entry(entry);
    var js = yield duo.run();
    var tpl = evaluate(js).main;
    var str = tpl({ who: 'matt' });
    assert('<h1>hi matt!</h1>' == str);
    assert(~js.indexOf('define.amd'))
  });

})


/**
 * Build `fixture` and return `str`.
 *
 * @param {String} fixture
 * @return {String}
 */

function build(fixture, file){
  var root = path(fixture);
  return Duo(root).entry(file || 'index.js');
}

/**
 * Evaluate `js`.
 *
 * @return {Object}
 */

function evaluate(js, ctx){
  var ctx = { window: {}, document: {} };
  vm.runInNewContext('main =' + js + '(1)', ctx, 'main.vm');
  vm.runInNewContext('require =' + js + '', ctx, 'require.vm');
  return ctx;
}

/**
 * Path to `fixture`
 */

function fixture(fixture){
  return join(__dirname, 'fixtures', fixture);
}
