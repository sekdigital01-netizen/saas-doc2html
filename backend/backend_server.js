// ============================================
// DOC2HTML SAAS - BACKEND
// Purpose: Convert DOCX/PPTX files to HTML
// Dependencies: express, multer, mammoth, cors, dotenv, @jvmr/pptx-to-html, jsdom
// Run: npm install && npm start
// ============================================

const express = require('express');
const multer = require('multer');
const mammoth = require('mammoth');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const { existsSync } = require('fs');
const { pptxToHtmlAsync } = require('./converters/pptxConverter');
require('dotenv').config();

const app = express();

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================
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
const ensureUploadsDir = async () => {
  try {
    if (!existsSync(uploadsDir)) {
      await fs.mkdir(uploadsDir, { recursive: true });
      console.log('✓ Created uploads directory');
    }
  } catch (err) {
    console.warn('⚠ Could not create uploads directory:', err.message);
  }
};
ensureUploadsDir();

// ============================================
// CONFIGURE FILE UPLOAD STORAGE
// ============================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
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
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No file uploaded',
        success: false 
      });
    }

    console.log(`Processing DOCX: ${req.file.originalname} (${req.file.size} bytes)`);
    filePath = req.file.path;

    const fileBuffer = await fs.readFile(filePath);
    const result = await mammoth.convertToHtml({ buffer: fileBuffer });

    console.log(`✓ Successfully converted DOCX: ${req.file.originalname}`);
    res.json({
      success: true,
      html: result.value,
      warnings: result.messages || [],
      fileName: req.file.originalname
    });

  } catch (error) {
    console.error('❌ DOCX conversion error:', error.message);
    res.status(500).json({ 
      error: 'Conversion failed',
      details: error.message,
      success: false 
    });

  } finally {
    if (filePath) {
      try {
        await fs.unlink(filePath);
        console.log(`✓ Cleaned up temporary file: ${filePath}`);
      } catch (cleanupError) {
        console.error('⚠️  Warning: Could not delete temp file:', cleanupError.message);
      }
    }
  }
});

// ============================================
// ENDPOINT 2: Convert PPTX to HTML
// POST /convert/pptx
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

    console.log(`Processing PPTX: ${req.file.originalname} (${req.file.size} bytes)`);
    filePath = req.file.path;

    const fileBuffer = await fs.readFile(filePath);
    const htmlOutput = await pptxToHtmlAsync(fileBuffer);

    console.log(`✓ Successfully converted PPTX: ${req.file.originalname}`);
    res.json({
      success: true,
      html: htmlOutput,
      fileName: req.file.originalname
    });

  } catch (error) {
    console.error('❌ PPTX conversion error:', error.message);
    res.status(500).json({ 
      error: 'PPTX conversion failed',
      details: error.message,
      success: false
    });

  } finally {
    if (filePath) {
      try {
        await fs.unlink(filePath);
        console.log(`✓ Cleaned up temporary file: ${filePath}`);
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
      convert_pptx: 'POST /convert/pptx'
    }
  });
});

// ============================================
// ENDPOINT 3: Health Check
// GET /health
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
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

app.use((error, req, res, next) => {
  console.error('❌ Global error:', error.message);
  
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
  console.log('║  • POST /convert/pptx                  ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('\n');
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

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
