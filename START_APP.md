# 🚀 Starting the Doc2HTML App

## Quick Start (3 Steps)

### Step 1: Open Terminal 1 - Start Backend
```bash
cd c:\Users\PERSONAL\Downloads\Saas\backend
npm start
```

**Expected Output:**
```
✓ Created uploads directory

╔════════════════════════════════════════╗
║   🚀 Doc2HTML Backend Server Started   ║
╠════════════════════════════════════════╣
║  URL: http://localhost:5000
║  Env: development
║  Endpoints:                            ║
║  • GET  /health                        ║
║  • POST /convert/docx                  ║
║  • POST /convert/pptx (coming soon)    ║
╚════════════════════════════════════════╝
```

**Keep this terminal open** - the backend needs to keep running.

---

### Step 2: Open Terminal 2 - Start Frontend
```bash
cd c:\Users\PERSONAL\Downloads\Saas\frontend
npm start
```

**Expected Output:**
```
> doc2html-frontend@0.1.0 start
> react-scripts start

Compiled successfully!

You can now view doc2html-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

**Keep this terminal open** - the frontend needs to keep running.

---

### Step 3: Open Browser
Visit: **http://localhost:3000**

You should see the Doc2HTML interface with:
- 📁 Upload area on the left
- 📄 Preview area on the right
- ✨ Convert button
- 💎 Pricing info (FREE & PRO tiers)

---

## Using the App

### Convert a Document

1. **Click** the upload box or **drag & drop** a file
   - Supported: `.docx`, `.doc`, `.pptx` (coming soon)
   - Max size: 10MB

2. **Click** "✨ Convert to HTML" button

3. **View** the HTML preview on the right

4. **Download** by clicking "⬇️ Download HTML"

---

## Troubleshooting

### Port Already in Use?
If you get `EADDRINUSE: address already in use :::5000` or `:::3000`:

**Kill processes on ports:**
```bash
# Kill process on port 5000
netstat -ano | findstr ":5000"
taskkill /PID <PID> /F

# Kill process on port 3000
netstat -ano | findstr ":3000"
taskkill /PID <PID> /F
```

Then start again.

### Frontend won't start?
```bash
cd c:\Users\PERSONAL\Downloads\Saas\frontend
npm cache clean --force
npm install
npm start
```

### Backend won't start?
```bash
cd c:\Users\PERSONAL\Downloads\Saas\backend
npm start
```

---

## Project Structure

```
Saas/
├── backend/
│   ├── backend_server.js      ← Node.js API server
│   ├── package.json
│   ├── .env
│   └── node_modules/          ← Dependencies (135 packages)
│
├── frontend/
│   ├── src/
│   │   ├── App.js             ← React main component
│   │   ├── App.css            ← Styling
│   │   ├── index.js           ← Entry point
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── .env
│   └── node_modules/          ← Dependencies (1300+ packages)
│
├── test-document.docx         ← Test file
└── START_APP.md               ← This file
```

---

## API Endpoints

### Backend (Port 5000)

#### Health Check
```bash
curl http://localhost:5000/health
```

**Response:**
```json
{
  "status": "Server is running ✓",
  "timestamp": "2026-05-19T17:49:57.662Z",
  "uptime": 20.4663542,
  "environment": "development"
}
```

#### Convert DOCX to HTML
```bash
curl -X POST http://localhost:5000/convert/docx \
  -F "file=@test-document.docx"
```

**Response:**
```json
{
  "success": true,
  "html": "<html>...</html>",
  "warnings": [],
  "originalFileName": "test-document.docx"
}
```

---

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
ALLOWED_ORIGINS=http://localhost:3000
MAX_FILE_SIZE=10485760
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_MAX_FILE_SIZE=10485760
REACT_APP_ENABLE_PPTX=false
```

---

## Features

✅ **Convert DOCX to HTML**
- Real-time preview
- Download as file
- Error handling

✅ **Responsive Design**
- Works on desktop
- Mobile-optimized
- Beautiful UI

✅ **Production Ready**
- Error handling
- Input validation
- Secure file uploads
- CORS configured

✅ **Free to Use**
- No signup required
- No watermarks
- Open source ready

---

## Development Commands

### Backend
```bash
# Start (production)
npm start

# Start with auto-reload
npm run dev

# Run tests
npm test
```

### Frontend
```bash
# Start dev server
npm start

# Build for production
npm build

# Run tests
npm test

# Eject (⚠️ one-way operation)
npm eject
```

---

## Testing

### Test with Sample File
Use the included `test-document.docx` file:
1. In the browser at http://localhost:3000
2. Drag `test-document.docx` onto the upload area
3. Click "✨ Convert to HTML"
4. Verify HTML preview appears
5. Click "⬇️ Download HTML" to save

---

## Performance

| Operation | Expected Time |
|-----------|---------------|
| Backend startup | 1-2 seconds |
| Frontend startup | 3-5 seconds |
| File upload | 1-2 seconds |
| DOCX→HTML conversion | 1-3 seconds |
| Download | <1 second |

---

## Next Steps

### To Deploy to Production

**Backend (Railway.app):**
See `DEPLOYMENT_GUIDE.md`

**Frontend (Vercel):**
See `DEPLOYMENT_GUIDE.md`

---

## Support

- 📖 See `README.md` for project overview
- 🚀 See `DEPLOYMENT_GUIDE.md` for deployment
- ✅ See `TESTING_GUIDE.md` for testing
- 📊 See `PROJECT_SUMMARY.md` for full details
- ✨ See `COMPLETION_REPORT.md` for status

---

**Happy converting! 🎉**

Backend: http://localhost:5000
Frontend: http://localhost:3000
