const { JSDOM } = require('jsdom');
const fs = require('fs').promises;

/**
 * Converts a PPTX file to HTML
 * @param {string} filePath - Path to the uploaded PPTX file
 * @returns {Promise<Object>} - Object containing success, html, and warnings
 */
async function convertPptxToHtml(filePath) {
  try {
    // Dynamic import for ESM module
    const { pptxToHtml } = await import('@jvmr/pptx-to-html');

    const fileBuffer = await fs.readFile(filePath);

    const jsdom = new JSDOM();
    // Note: Some browser-based libraries expect these on global
    const originalWindow = global.window;
    const originalDocument = global.document;
    const originalNode = global.Node;
    const originalElement = global.Element;
    const originalDOMParser = global.DOMParser;

    global.window = jsdom.window;
    global.document = jsdom.window.document;
    global.Node = jsdom.window.Node;
    global.Element = jsdom.window.Element;
    global.DOMParser = jsdom.window.DOMParser;

    try {
      const slidesHtml = await pptxToHtml(fileBuffer.buffer, {
        width: 960,
        height: 540,
        scaleToFit: true,
        domParserFactory: () => new jsdom.window.DOMParser(),
      });

      // Wrap slides in a container for better styling
      const wrappedHtml = slidesHtml.map((slide, index) =>
        `<div class="pptx-slide" data-slide-index="${index}">${slide}</div>`
      ).join('\n');

      return {
        success: true,
        html: `<div class="pptx-container">${wrappedHtml}</div>`,
        warnings: []
      };
    } finally {
      // Restore globals
      global.window = originalWindow;
      global.document = originalDocument;
      global.Node = originalNode;
      global.Element = originalElement;
      global.DOMParser = originalDOMParser;
    }
  } catch (error) {
    console.error('PPTX Conversion Error:', error);
    throw error;
  }
}

module.exports = {
  convertPptxToHtml
};
