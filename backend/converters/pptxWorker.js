const { parentPort, workerData } = require('worker_threads');
const { JSDOM } = require('jsdom');
const fs = require('fs');

async function convert() {
  try {
    const { filePath } = workerData;
    const buffer = fs.readFileSync(filePath);

    // Simulate browser environment for @jvmr/pptx-to-html BEFORE import
    const dom = new JSDOM('<!DOCTYPE html><html><body><div id="container"></div></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
    global.navigator = dom.window.navigator;
    global.Node = dom.window.Node;
    global.Element = dom.window.Element;
    global.HTMLElement = dom.window.HTMLElement;
    global.Image = dom.window.Image;
    global.Blob = dom.window.Blob;
    global.DOMParser = dom.window.DOMParser;
    global.XMLSerializer = dom.window.XMLSerializer;

    if (typeof global.self === 'undefined') {
        global.self = global;
    }

    // Dynamically import ES module
    const mod = await import('@jvmr/pptx-to-html');
    const pptxToHtml = mod.default || mod.pptxToHtml || mod;

    if (typeof pptxToHtml !== 'function') {
        throw new Error('pptxToHtml is not a function after import. Type: ' + typeof pptxToHtml);
    }

    const html = await pptxToHtml(buffer);
    parentPort.postMessage({ success: true, html });
  } catch (error) {
    parentPort.postMessage({ success: false, error: error.message });
  }
}

convert();
