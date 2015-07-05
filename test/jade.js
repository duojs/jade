/**
 * Module Dependencies
 */

var assert = require('assert');
var Duo = require('duo');
var jade = require('..');
var path = require('path');
var rm = require('rimraf').sync;
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
    var tpl = evaluate(js.code).main;
    var str = tpl({ who: 'matt' });
    assert.equal(str, '<h1>hi matt!</h1>');
  });

  it('should include the jade runtime', function*() {
    var duo = build('simple').use(jade());
    yield duo.run();
    assert(duo.included('jade-runtime'));
  });

  it('should pass options to jade', function*() {
    var duo = build('pretty').use(jade({ pretty: true }));
    var js = yield duo.run();
    var tpl = evaluate(js.code).main;
    var str = tpl({ who: 'matt' }).trim();
    assert.equal(str, '<ul>\n  <li>a</li>\n  <li>b</li>\n</ul>');
  });

});

/**
 * Cleans up the fixtures between tests.
 */

function cleanup() {
  rm(fixture('*/{components,build}'));
}

/**
 * Build `fixture` and return `str`.
 *
 * @param {String} fixture
 * @return {String}
 */

function build(name, file){
  var root = fixture(name);
  return Duo(root).cache(false).entry(file || 'index.js');
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
