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
      // Dynamic import is still needed for ESM package in CJS environment
      const { pptxToHtml } = await import('@jvmr/pptx-to-html');
      const dom = new JSDOM('<!DOCTYPE html><html><body><div id="container"></div></body></html>');

      const { window } = dom;
      global.window = window;
      global.document = window.document;
      global.navigator = window.navigator;
      global.Node = window.Node;
      global.Element = window.Element;
      global.CharacterData = window.CharacterData;
      global.DOMParser = window.DOMParser;
      global.XMLSerializer = window.XMLSerializer;
      global.Image = window.Image;
      global.Blob = window.Blob;

      const htmlOutput = await pptxToHtml(workerData);
      parentPort.postMessage({ html: htmlOutput });
    } catch (err) {
      parentPort.postMessage({ error: err.message || String(err) });
    } finally {
      process.exit(0);
    }
  })();
}

module.exports = { pptxToHtmlAsync };
