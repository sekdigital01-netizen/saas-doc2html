const { workerData, parentPort } = require('worker_threads');
const fs = require('fs');

async function convert() {
  const { filePath } = workerData;

  try {
    // Dynamic import for ESM-only packages
    const pptxModule = await import('@jvmr/pptx-to-html');
    const { JSDOM } = await import('jsdom');

    const pptxToHtml = pptxModule.pptxToHtml || pptxModule.default?.pptxToHtml || pptxModule.default;

    if (typeof pptxToHtml !== 'function') {
      throw new Error('pptxToHtml is not a function. Module contents: ' + Object.keys(pptxModule).join(', '));
    }

    // Set up JSDOM for pptx-to-html
    const dom = new JSDOM('<!DOCTYPE html><html><body><div id="container"></div></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
    global.navigator = dom.window.navigator;
    global.Node = dom.window.Node;
    global.Element = dom.window.Element;
    global.HTMLElement = dom.window.HTMLElement;
    global.DOMParser = dom.window.DOMParser;
    global.XMLSerializer = dom.window.XMLSerializer;

    const fileBuffer = fs.readFileSync(filePath);

    let htmlSlides;
    try {
      const converter = new pptxToHtml();
      htmlSlides = await converter.convert(fileBuffer);
    } catch (e) {
      htmlSlides = await pptxToHtml(fileBuffer);
    }

    parentPort.postMessage({ success: true, html: htmlSlides });
  } catch (error) {
    parentPort.postMessage({ success: false, error: error.message });
  }
}

convert();
