// ============================================
// DOC2HTML SAAS - FRONTEND
// React Component
// npm install react axios
// ============================================

import React, { useState } from 'react';
import axios from 'axios';
import './Doc2HTML.css'; // Import CSS below

export default function Doc2HTML() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError('');
    }
  };

  // Handle file upload and conversion
  const handleConvert = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');
    setHtmlContent('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Determine endpoint based on file type
      const endpoint = file.name.endsWith('.docx') 
        ? '/convert/docx' 
        : '/convert/pptx';

      // Send to backend
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${endpoint}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.success) {
        setHtmlContent(response.data.html);
      } else {
        setError('Conversion failed');
      }

    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Is the server running?');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Download HTML as file
  const downloadHTML = () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent));
    element.setAttribute('download', `${fileName}.html`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="doc2html-container">
      {/* Header */}
      <div className="header">
        <h1>Doc2HTML</h1>
        <p>Convert Word & PowerPoint files to HTML in seconds</p>
      </div>

      {/* Main Content */}
      <div className="content">
        {/* Left: Upload Section */}
        <div className="upload-section">
          <div className="upload-box">
            <h2>Step 1: Upload File</h2>
            
            <div className="file-input-wrapper">
              <input
                type="file"
                id="file-input"
                accept=".docx,.pptx,.doc"
                onChange={handleFileChange}
                disabled={loading}
              />
              <label htmlFor="file-input" className="file-label">
                <span className="upload-icon">📁</span>
                <span className="upload-text">
                  {fileName || 'Click to select file or drag here'}
                </span>
              </label>
            </div>

            <div className="file-info">
              Supported: .docx, .doc (PPTX coming soon)
              <br />
              Max size: 10MB
            </div>

            <button 
              onClick={handleConvert}
              disabled={!file || loading}
              className={`convert-btn ${loading ? 'loading' : ''}`}
            >
              {loading ? '⏳ Converting...' : '✨ Convert to HTML'}
            </button>
          </div>

          {/* Free vs Pro */}
          <div className="pricing-info">
            <div className="tier free">
              <h4>🎁 FREE</h4>
              <p>• 5 conversions/day</p>
              <p>• Watermark shown</p>
              <p>• No download</p>
            </div>
            <div className="tier pro">
              <h4>💎 PRO ($5/mo)</h4>
              <p>• Unlimited conversions</p>
              <p>• No watermark</p>
              <p>• Download as HTML</p>
            </div>
          </div>
        </div>

        {/* Right: Preview Section */}
        <div className="preview-section">
          {error && (
            <div className="error-message">
              <span>❌ {error}</span>
            </div>
          )}

          {htmlContent && (
            <div className="preview-container">
              <div className="preview-header">
                <h2>Step 2: Preview & Download</h2>
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
              <p>Upload a file to see preview here</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <p>Secure • Fast • Free • No signup required</p>
      </div>
    </div>
  );
}
