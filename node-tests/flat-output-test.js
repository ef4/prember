const { module: Qmodule, test } = require('qunit');
const fs = require('fs');
const path = require('path');
const os = require('os');

const Prerender = require('../lib/prerender');

function createPrerender(options = {}) {
  let instance = Object.create(Prerender.prototype);
  instance.rootURL = options.rootURL || '/';
  instance.indexFile = options.indexFile || 'index.html';
  instance.flatOutput = options.flatOutput || false;
  Object.defineProperty(instance, 'outputPath', { value: options.outputPath });
  return instance;
}

Qmodule('flatOutput', function (hooks) {
  let tmpDir;

  hooks.beforeEach(function () {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'prember-test-'));
  });

  hooks.afterEach(function () {
    fs.rmSync(tmpDir, { recursive: true });
  });

  test('default output writes index.html in subdirectory', async function (assert) {
    let prerender = createPrerender({ outputPath: tmpDir });
    await prerender._writeFile('/foo/bar', '<html>test</html>');
    assert.ok(fs.existsSync(path.join(tmpDir, 'foo', 'bar', 'index.html')));
  });

  test('flatOutput writes .html files instead of subdirectories', async function (assert) {
    let prerender = createPrerender({ outputPath: tmpDir, flatOutput: true });
    await prerender._writeFile('/foo/bar', '<html>test</html>');
    assert.ok(fs.existsSync(path.join(tmpDir, 'foo', 'bar.html')));
    assert.notOk(fs.existsSync(path.join(tmpDir, 'foo', 'bar', 'index.html')));
  });

  test('flatOutput still writes index.html for root URL', async function (assert) {
    let prerender = createPrerender({ outputPath: tmpDir, flatOutput: true });
    await prerender._writeFile('/', '<html>root</html>');
    assert.ok(fs.existsSync(path.join(tmpDir, 'index.html')));
  });

  test('flatOutput works with custom rootURL', async function (assert) {
    let prerender = createPrerender({ outputPath: tmpDir, flatOutput: true, rootURL: '/app/' });
    await prerender._writeFile('/app/foo/bar', '<html>test</html>');
    assert.ok(fs.existsSync(path.join(tmpDir, 'foo', 'bar.html')));
  });
});
