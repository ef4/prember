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
  constructor(builtAppTree, { urls, indexFile, emptyFile }) {
    super([builtAppTree], { name: 'prember', needsCache: false });
    this.urls = urls || [];
    this.indexFile = indexFile || 'index.html';
    this.emptyFile = emptyFile || '_empty.html';
  }

  async listUrls() {
    if (typeof this.urls === 'function') {
      return await this.urls();
    } else {
      return this.urls;
    }
  }

  async build() {
    let pkg;
    try {
      pkg = require(path.join(this.inputPaths[0], 'package.json'));
    } catch(err) {
      throw new Error(`Unable to load package.json from within your built application. Did you forget to add ember-cli-fastboot to your app? ${err}`)
    }

    /* Move the original "empty" index.html HTML file to an
       out-of-the-way place, and rewrite the fastboot manifest to
       point at it. This ensures that:

       (1) even if you have prerendered the contents of your homepage,
           causing the empty "index.html" to get replaced with actual
           content, we still keep a copy of the original empty
           index.html file that can be used to serve URLs that don't
           have a prerendered version. You wouldn't want a flash of
           your homepage content to appear on every non-prerendered
           route.

       (2) if you choose to run the prerendered app inside a fastboot
           server for some reason (this happens in development by
           default), fastboot will still work correctly because it can
           find the empty index.html file.
    */

    let htmlFile = await readFile(path.join(this.inputPaths[0], pkg.fastboot.manifest.htmlFile), 'utf8');
    await writeFile(path.join(this.outputPath, this.emptyFile), htmlFile);
    pkg.fastboot.manifest.htmlFile = this.emptyFile;
    await writeFile(path.join(this.outputPath, 'package.json'), JSON.stringify(pkg));

    let app = new FastBoot({
      distPath: this.inputPaths[0],
      resilient: false
    });
    for (let url of await this.listUrls()) {
      let page = await app.visit(url);
      let html = await page.html();
      let filename = path.join(this.outputPath, url, this.indexFile);
      await mkdirp(path.dirname(filename));
      await writeFile(filename, html);
    }
  }

}

module.exports = Prerender;
