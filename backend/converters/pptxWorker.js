const { parentPort, workerData } = require('worker_threads');
const { JSDOM } = require('jsdom');
const { pptxToHtml } = require('@jvmr/pptx-to-html');

async function convert() {
  try {
    const { buffer } = workerData;

    // In Node, there is no built-in DOMParser. Provide one via domParserFactory.
    // We use jsdom to provide a DOM environment.
    const dom = new JSDOM();
    global.window = dom.window;
    global.document = dom.window.document;
    global.navigator = dom.window.navigator;
    global.Node = dom.window.Node;

    const slidesHtml = await pptxToHtml(buffer, {
      width: 960,
      height: 540,
      scaleToFit: true,
      domParserFactory: () => new dom.window.DOMParser(),
    });

    parentPort.postMessage({ success: true, slidesHtml });
  } catch (error) {
    parentPort.postMessage({ success: false, error: error.message });
  }
}

convert();
