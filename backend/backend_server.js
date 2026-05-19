// ============================================
// DOC2HTML SAAS - BACKEND
// Purpose: Convert DOCX/PPTX files to HTML
// Dependencies: express, multer, mammoth, cors, dotenv
// Run: npm install && npm start
// ============================================

const express = require('express');
const multer = require('multer');
const mammoth = require('mammoth');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config(); // Load environment variables

const app = express();

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================
// Enable CORS with specific options
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// CREATE UPLOADS DIRECTORY IF NOT EXISTS
// ============================================
const uploadsDir = path.join(__dirname, 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✓ Created uploads directory');
  }
} catch (err) {
  console.warn('⚠ Could not create uploads directory:', err.message);
}

// ============================================
// CONFIGURE FILE UPLOAD STORAGE
// ============================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store files in uploads folder
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    // Only allow DOCX, DOC, and PPTX files
    const allowedMimes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only .docx, .doc, and .pptx allowed'), false);
    }
  }
});

// ============================================
// ENDPOINT 1: Convert DOCX to HTML
// POST /convert/docx
// ============================================
app.post('/convert/docx', upload.single('file'), async (req, res) => {
  let filePath = null;
  
  try {
    // Validate file upload
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No file uploaded',
        success: false 
      });
    }

    console.log(`Processing file: ${req.file.originalname} (${req.file.size} bytes)`);
    filePath = req.file.path;

    // Read the uploaded file buffer
    const fileBuffer = fs.readFileSync(filePath);

    // Convert DOCX to HTML using mammoth
    const result = await mammoth.convertToHtml({ buffer: fileBuffer });

    // Return successful conversion
    res.json({
      success: true,
      html: result.value,
      warnings: result.messages || [],
      fileName: req.file.originalname
    });

    console.log(`✓ Successfully converted: ${req.file.originalname}`);

  } catch (error) {
    console.error('❌ Conversion error:', error.message);
    res.status(500).json({ 
      error: 'Conversion failed',
      details: error.message,
      success: false 
    });

  } finally {
    // Clean up uploaded file (always, even on error)
    if (filePath) {
      try {
        fs.unlinkSync(filePath);
        console.log(`✓ Cleaned up temporary file: ${filePath}`);
      } catch (cleanupError) {
        console.error('⚠️  Warning: Could not delete temp file:', cleanupError.message);
      }
    }
  }
});

// ============================================
// ENDPOINT 2: Convert PPTX to HTML (MVP version)
// POST /convert/pptx
// Note: Full PPTX conversion requires additional libraries
// ============================================
app.post('/convert/pptx', upload.single('file'), async (req, res) => {
  let filePath = null;
  
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No file uploaded',
        success: false 
      });
    }

    console.log(`PPTX request received: ${req.file.originalname}`);
    filePath = req.file.path;

    // TODO: Implement full PPTX conversion with pptxjs library
    // For MVP, return placeholder response
    res.json({
      success: false,
      message: 'PPTX conversion coming in v2',
      html: '<div style="padding: 20px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px;"><strong>Note:</strong> PowerPoint conversion is coming in the next version. Currently supporting .docx files only.</div>'
    });

  } catch (error) {
    console.error('❌ PPTX conversion error:', error.message);
    res.status(500).json({ 
      error: 'PPTX conversion failed',
      details: error.message,
      success: false
    });

  } finally {
    // Clean up uploaded file
    if (filePath) {
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupError) {
        console.error('⚠️  Warning: Could not delete PPTX temp file:', cleanupError.message);
      }
    }
  }
});

// ============================================
// ENDPOINT 1: Root Endpoint
// GET /
// ============================================
app.get('/', (req, res) => {
  res.json({
    message: 'Doc2HTML API Server',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      convert_docx: 'POST /convert/docx',
      convert_pptx: 'POST /convert/pptx (coming soon)'
    }
  });
});

// ============================================
// ENDPOINT 3: Health Check
// GET /health
// Used to verify server is running
// ============================================
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Server is running ✓',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================
// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ Global error:', error.message);
  
  // Handle multer errors
  if (error.message && error.message.includes('Invalid file type')) {
    return res.status(400).json({ 
      error: error.message,
      success: false 
    });
  }

  res.status(500).json({ 
    error: error.message || 'Internal server error',
    success: false
  });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log('Starting server with PORT:', PORT);
console.log('NODE_ENV:', NODE_ENV);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('\n');
  console.log('╔════════════════════════════════════════╗');
  console.log('║   🚀 Doc2HTML Backend Server Started   ║');
  console.log('╠════════════════════════════════════════╣');
  console.log(`║  Listening on port: ${PORT}`);
  console.log(`║  Env: ${NODE_ENV}`);
  console.log('║  Endpoints:                            ║');
  console.log('║  • GET  /health                        ║');
  console.log('║  • POST /convert/docx                  ║');
  console.log('║  • POST /convert/pptx (coming soon)    ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('\n');
});

// Error handling
server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n📌 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✓ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n📌 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✓ Server closed');
    process.exit(0);
  });
});
