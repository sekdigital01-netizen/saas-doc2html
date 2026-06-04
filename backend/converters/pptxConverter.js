const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { JSDOM } = require('jsdom');

async function pptxToHtmlAsync(fileBuffer) {
  if (isMainThread) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: fileBuffer
      });
      worker.on('message', (msg) => {
        if (msg.error) reject(new Error(msg.error));
        else resolve(msg.html);
      });
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  }
}

if (!isMainThread) {
  (async () => {
    try {
      const { pptxToHtml } = await import('@jvmr/pptx-to-html');
      const dom = new JSDOM('<!DOCTYPE html><html><body><div id="container"></div></body></html>');

      global.window = dom.window;
      global.document = dom.window.document;
      global.navigator = dom.window.navigator;
      global.Node = dom.window.Node;
      global.Element = dom.window.Element;
      global.CharacterData = dom.window.CharacterData;
      global.DOMParser = dom.window.DOMParser;
      global.XMLSerializer = dom.window.XMLSerializer;
      global.Image = dom.window.Image;
      global.Blob = dom.window.Blob;

      const htmlOutput = await pptxToHtml(workerData);
      parentPort.postMessage({ html: htmlOutput });
    } catch (err) {
      parentPort.postMessage({ error: err.message || String(err) });
    }
  })();
}

module.exports = { pptxToHtmlAsync };
