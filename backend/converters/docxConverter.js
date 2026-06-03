const mammoth = require('mammoth');
const fs = require('fs').promises;

/**
 * Converts a DOCX file to HTML
 * @param {string} filePath - Path to the uploaded DOCX file
 * @returns {Promise<Object>} - Object containing success, html, and warnings
 */
async function convertDocxToHtml(filePath) {
  try {
    const fileBuffer = await fs.readFile(filePath);
    const result = await mammoth.convertToHtml({ buffer: fileBuffer });

    return {
      success: true,
      html: result.value,
      warnings: result.messages || []
    };
  } catch (error) {
    console.error('DOCX Conversion Error:', error);
    throw error;
  }
}

module.exports = {
  convertDocxToHtml
};
