/* eslint-env node */

const Plugin = require('broccoli-plugin');
const FastBoot = require('fastboot');
const fs = require('fs');
const denodeify = require('denodeify');
const writeFile = denodeify(fs.writeFile);
const readFile = denodeify(fs.readFile);
const mkdirp = denodeify(require('mkdirp'));
const path = require('path');


class Prerender extends Plugin {
  constructor(builtAppTree, { urls, indexFile }) {
    super([builtAppTree], { name: 'prember', needsCache: false });
    this.urls = urls || [];
    this.indexFile = indexFile || 'index.html';
  }

  async build() {
    let pkg;
    try {
      pkg = require(path.join(this.inputPaths[0], 'package.json'));
    } catch(err) {
      throw new Error(`Unable to load package.json from within your built application. Did you forget to add ember-cli-fastboot to your app? ${err}`)
    }

    // Move the original "empty" HTML file to an out-of-the-way place, and rewrite the fastboot manifest to point at it. This ensures that:
    //
    // - (1) you can configure your webserver to handle 404s with `_empty.html`, causing the Ember app to handle URLs that weren't prerendered.
    // - (2) if you do try to run the built app under a fastboot server, it will still work. This particularly matters in development.
    let htmlFile = await readFile(path.join(this.inputPaths[0], pkg.fastboot.manifest.htmlFile), 'utf8');
    await writeFile(path.join(this.outputPath, '_empty.html'), htmlFile);
    pkg.fastboot.manifest.htmlFile = '_empty.html';
    await writeFile(path.join(this.outputPath, 'package.json'), JSON.stringify(pkg));

    let app = new FastBoot({
      distPath: this.inputPaths[0],
      resilient: false
    });
    for (let url of this.urls) {
      let page = await app.visit(url);
      let html = await page.html();
      let filename = path.join(this.outputPath, url, this.indexFile);
      await mkdirp(path.dirname(filename));
      await writeFile(filename, html);
    }
  }

}

module.exports = Prerender;
