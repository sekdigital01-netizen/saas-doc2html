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
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
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
    const fileName = selectedFile.name.toLowerCase();
    const hasValidExtension = ALLOWED_TYPES.some(type => fileName.endsWith(type));
    
    if (!hasValidExtension) {
      setError(`Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}`);
      return false;
    }

    // Check file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`File size exceeds 10MB limit. Your file: ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB`);
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
    
    // Validate file exists
    if (!file) {
      setError('Please select a file first');
      return;
    }

    // Reset state
    setLoading(true);
    setError('');
    setHtmlContent('');
    setConversionStats(null);

    try {
      console.log('📤 Uploading file:', file.name);

      // Prepare form data
      const formData = new FormData();
      formData.append('file', file);

      // Determine endpoint based on file type
      const endpoint = file.name.toLowerCase().endsWith('.docx') 
        ? '/convert/docx' 
        : file.name.toLowerCase().endsWith('.doc')
        ? '/convert/docx' // .doc also uses docx converter
        : '/convert/pptx';

      // Send conversion request
      const response = await axios.post(
        `${API_URL}${endpoint}`,
        formData,
        { 
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 30000 // 30 second timeout
        }
      );

      // Check if conversion was successful
      if (response.data.success) {
        let html = '';
        if (response.data.html) {
          html = response.data.html;
        } else if (response.data.slides && Array.isArray(response.data.slides)) {
          // Join slides with a separator for preview
          html = response.data.slides.join('<hr style="margin: 40px 0; border: 0; border-top: 2px dashed #eee;" />');
        }

        if (html) {
          setHtmlContent(html);
          setConversionStats({
            fileName: response.data.fileName,
            warnings: response.data.warnings?.length || 0
          });
          console.log('✓ Conversion successful');

          // Show warning if any
          if (response.data.warnings && response.data.warnings.length > 0) {
            console.warn('⚠️  Conversion warnings:', response.data.warnings);
          }
        } else {
          setError('Conversion returned no content');
        }
      } else {
        setError(response.data.message || 'Conversion failed');
      }

    } catch (err) {
      // Comprehensive error handling
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout - server took too long to respond');
      } else if (err.response?.status === 400) {
        setError(err.response.data?.error || 'Invalid file format');
      } else if (err.response?.status === 500) {
        setError('Server error during conversion. Please try again.');
      } else if (err.message === 'Network Error') {
        setError('Cannot reach server. Is the backend running on http://localhost:5000?');
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
      // Create blob from HTML content
      const element = document.createElement('a');
      const htmlBlob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(htmlBlob);
      
      // Generate filename
      const downloadName = fileName.replace(/\.[^/.]+$/, '') + '.html';
      
      // Trigger download
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

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="doc2html-container">
      {/* Header Section */}
      <div className="header">
        <h1>📄 Doc2HTML Converter</h1>
        <p>Convert Word & PowerPoint files to HTML in seconds</p>
      </div>

      {/* Main Content */}
      <div className="content">
        {/* Left: Upload Section */}
        <div className="upload-section">
          <div className="upload-box">
            <h2>Step 1: Upload Your File</h2>
            
            {/* File Input with Drag & Drop */}
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

            {/* File Info */}
            <div className="file-info">
              <strong>Supported formats:</strong> .docx, .doc, .pptx (coming soon)
              <br />
              <strong>Max size:</strong> 10MB
              <br />
              <strong>Processing:</strong> Client + Server (secure)
            </div>

            {/* Convert Button */}
            <div className="button-group">
              <button 
                onClick={handleConvert}
                disabled={!file || loading}
                className={`convert-btn ${loading ? 'loading' : ''}`}
                title={!file ? 'Select a file first' : 'Convert file to HTML'}
              >
                {loading ? '⏳ Converting...' : '✨ Convert to HTML'}
              </button>
              
              {(file || htmlContent) && (
                <button 
                  onClick={handleReset}
                  disabled={loading}
                  className="reset-btn"
                  title="Clear selection and start over"
                >
                  ↻ Reset
                </button>
              )}
            </div>

            {/* Pricing Info */}
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

        {/* Right: Preview Section */}
        <div className="preview-section">
          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span>❌ {error}</span>
              <button 
                className="close-error"
                onClick={() => setError('')}
                title="Dismiss error"
              >
                ×
              </button>
            </div>
          )}

          {/* Preview & Download */}
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
                <button 
                  onClick={downloadHTML} 
                  className="download-btn"
                  title="Download as HTML file"
                >
                  ⬇️ Download HTML
                </button>
              </div>
              
              {/* HTML Preview */}
              <div className="html-preview">
                <div 
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                  className="preview-content"
                />
              </div>
            </div>
          )}

          {/* Empty State */}
          {!htmlContent && !error && (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <p>Upload and convert a file to see preview here</p>
              <small>Your conversion will appear on this side</small>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <p>🔒 Secure • ⚡ Fast • 🆓 Free • No signup required</p>
        <small>Backend: {API_URL}</small>
      </div>
    </div>
  );
}
