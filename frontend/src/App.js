// ============================================
// DOC2HTML SAAS - FRONTEND
// React Component for file upload and conversion
// Dependencies: react, axios
// ============================================

import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

/**
 * Main App Component
 * Handles file upload, conversion, preview, and download
 */
export default function Doc2HTML() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [file, setFile] = useState(null); // Selected file
  const [loading, setLoading] = useState(false); // Loading state during conversion
  const [htmlContent, setHtmlContent] = useState(''); // Converted HTML content
  const [error, setError] = useState(''); // Error messages
  const [fileName, setFileName] = useState(''); // Original file name
  const [conversionStats, setConversionStats] = useState(null); // Conversion metadata

  // Configuration
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const MAX_FILE_SIZE = parseInt(process.env.REACT_APP_MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB
  const ENABLE_PPTX = process.env.REACT_APP_ENABLE_PPTX !== 'false';
  const ALLOWED_TYPES = ['.docx', '.doc', '.pptx'];

  /**
   * Validate file before upload
   * Checks: file type, file size
   */
  const validateFile = (selectedFile) => {
    // Check if file exists
    if (!selectedFile) {
      setError('Please select a file');
      return false;
    }

    // Check file extension
    const name = selectedFile.name.toLowerCase();
    const hasValidExtension = ALLOWED_TYPES.some(type => name.endsWith(type));
    
    if (!hasValidExtension) {
      setError(`Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}`);
      return false;
    }

    // Check if PPTX is enabled
    if (name.endsWith('.pptx') && !ENABLE_PPTX) {
      setError('PowerPoint conversion is currently disabled.');
      return false;
    }

    // Check file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`File size exceeds limit. Your file: ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB`);
      return false;
    }

    return true;
  };

  /**
   * Handle file selection from input
   */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError('');
      setHtmlContent(''); // Clear previous conversion
      console.log('✓ File selected:', selectedFile.name);
    }
  };

  /**
   * Handle drag and drop file upload
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-active');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-active');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-active');
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
      setFileName(droppedFile.name);
      setError('');
      setHtmlContent('');
      console.log('✓ File dropped:', droppedFile.name);
    }
  };

  /**
   * Main conversion function
   * Sends file to backend for conversion
   */
  const handleConvert = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');
    setHtmlContent('');
    setConversionStats(null);

    try {
      console.log('📤 Uploading file:', file.name);

      const formData = new FormData();
      formData.append('file', file);

      // Determine endpoint based on file type
      const endpoint = file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.doc')
        ? '/convert/docx' 
        : '/convert/pptx';

      // Send conversion request
      const response = await axios.post(
        `${API_URL}${endpoint}`,
        formData,
        { 
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 60000 // 60 second timeout for PPTX
        }
      );

      if (response.data.success && response.data.html) {
        setHtmlContent(response.data.html);
        setConversionStats({
          fileName: response.data.fileName,
          warnings: response.data.warnings?.length || 0
        });
        console.log('✓ Conversion successful');
      } else {
        setError(response.data.error || 'Conversion returned no content');
      }

    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout - server took too long to respond');
      } else if (err.response?.status === 400) {
        setError(err.response.data?.error || 'Invalid file format');
      } else if (err.response?.status === 500) {
        setError('Server error during conversion. Please try again.');
      } else if (err.message === 'Network Error') {
        setError(`Cannot reach server at ${API_URL}. Is the backend running?`);
      } else {
        setError(err.response?.data?.error || err.message || 'Upload failed. Please try again.');
      }
      
      console.error('❌ Conversion error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Download converted HTML as file
   */
  const downloadHTML = () => {
    try {
      const element = document.createElement('a');
      const htmlBlob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(htmlBlob);
      
      const downloadName = fileName.replace(/\.[^/.]+$/, '') + '.html';
      
      element.setAttribute('href', url);
      element.setAttribute('download', downloadName);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      URL.revokeObjectURL(url);
      
      console.log('✓ Downloaded:', downloadName);
    } catch (err) {
      setError('Failed to download file: ' + err.message);
      console.error('❌ Download error:', err);
    }
  };

  /**
   * Clear all state and reset form
   */
  const handleReset = () => {
    setFile(null);
    setFileName('');
    setError('');
    setHtmlContent('');
    setConversionStats(null);
    console.log('↻ Form reset');
  };

  return (
    <div className="doc2html-container">
      <div className="header">
        <h1>📄 Doc2HTML Converter</h1>
        <p>Convert Word & PowerPoint files to HTML in seconds</p>
      </div>

      <div className="content">
        <div className="upload-section">
          <div className="upload-box">
            <h2>Step 1: Upload Your File</h2>
            
            <div 
              className="file-input-wrapper"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-input"
                accept=".docx,.doc,.pptx"
                onChange={handleFileChange}
                disabled={loading}
              />
              <label htmlFor="file-input" className="file-label">
                <span className="upload-icon">📁</span>
                <span className="upload-text">
                  {fileName ? `✓ ${fileName}` : 'Click to select or drag file here'}
                </span>
              </label>
            </div>

            <div className="file-info">
              <strong>Supported formats:</strong> .docx, .doc, .pptx
              <br />
              <strong>Max size:</strong> {(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB
            </div>

            <div className="button-group">
              <button 
                onClick={handleConvert}
                disabled={!file || loading}
                className={`convert-btn ${loading ? 'loading' : ''}`}
              >
                {loading ? '⏳ Converting...' : '✨ Convert to HTML'}
              </button>
              
              {(file || htmlContent) && (
                <button 
                  onClick={handleReset}
                  disabled={loading}
                  className="reset-btn"
                >
                  ↻ Reset
                </button>
              )}
            </div>

            <div className="pricing-info">
              <div className="tier free">
                <h4>🎁 FREE</h4>
                <p>✓ 5 conversions/day</p>
                <p>✓ Instant conversion</p>
                <p>✓ Download HTML</p>
              </div>
              <div className="tier pro">
                <h4>💎 PRO ($5/mo)</h4>
                <p>✓ Unlimited conversions</p>
                <p>✓ Priority processing</p>
                <p>✓ API access</p>
              </div>
            </div>
          </div>
        </div>

        <div className="preview-section">
          {error && (
            <div className="error-message">
              <span>❌ {error}</span>
              <button className="close-error" onClick={() => setError('')}>×</button>
            </div>
          )}

          {htmlContent && (
            <div className="preview-container">
              <div className="preview-header">
                <div className="preview-title">
                  <h2>Step 2: Preview & Download</h2>
                  {conversionStats && (
                    <p className="conversion-stats">
                      ✓ Converted: {conversionStats.fileName}
                      {conversionStats.warnings > 0 && ` (${conversionStats.warnings} warnings)`}
                    </p>
                  )}
                </div>
                <button onClick={downloadHTML} className="download-btn">
                  ⬇️ Download HTML
                </button>
              </div>
              
              <div className="html-preview">
                <div 
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                  className="preview-content"
                />
              </div>
            </div>
          )}

          {!htmlContent && !error && (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <p>Upload and convert a file to see preview here</p>
            </div>
          )}
        </div>
      </div>

      <div className="footer">
        <p>🔒 Secure • ⚡ Fast • 🆓 Free • No signup required</p>
        <small>Backend: {API_URL}</small>
      </div>
    </div>
  );
}
