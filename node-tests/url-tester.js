const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports = async function({ distDir, visit }) {
  let urls = ['/', '/redirects', '/use-static-asset'];

  // Here we exercise the ability to make requests against the
  // fastboot app in order to discover more urls
  let page = await visit('/');
  if (page.statusCode === 200) {
    let html = await page.html();
    let dom = new JSDOM(html);
    for (let aTag of [...dom.window.document.querySelectorAll('a')]) {
      if (aTag.href) {
        urls.push(aTag.href);
      }
    }
  }

  // Here we exercise the ability to inspect the build output of the
  // app to discover more urls
  let sampleData = require(distDir + '/sample-data.json');
  for (let entry of sampleData) {
    urls.push(entry.url);
  }

  return urls;
}
