/**
 * Module Dependencies
 */

var assert = require('assert');
var Duo = require('duo');
var jade = require('..');
var path = require('path');
var rm = require('rimraf-then');
var vm = require('vm');

/**
 * Locals.
 */

var fixture = path.join.bind(path, __dirname, 'fixtures');

/**
 * Tests
 */

describe('duo-jade', function() {

  beforeEach(cleanup);
  after(cleanup);

  it('should transpile simple jade templates', function*() {
    var duo = build('simple').use(jade());
    var js = yield duo.run();
    var tpl = evaluate(js).main;
    var str = tpl({ who: 'matt' });
    assert('<h1>hi matt!</h1>' == str);
  });

  it('should include the jade runtime', function*() {
    var duo = build('simple').use(jade());
    var js = yield duo.run();
    assert(duo.included('jade-runtime'));
  });

});

/**
 * Cleans up the fixtures between tests.
 */

function *cleanup() {
  yield rm(fixture('*/{components,build}'));
}

/**
 * Build `fixture` and return `str`.
 *
 * @param {String} fixture
 * @return {String}
 */

function build(name, file){
  var root = fixture(name);
  return Duo(root).entry(file || 'index.js');
}

/**
 * Evaluate `js`.
 *
 * @return {Object}
 */

function evaluate(js){
  var ctx = { window: {}, document: {} };
  vm.runInNewContext('main =' + js + '(1)', ctx, 'main.vm');
  vm.runInNewContext('require =' + js + '', ctx, 'require.vm');
  return ctx;
}
