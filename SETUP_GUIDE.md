# 🛠️ Doc2HTML Setup Guide: Modern Developer Experience

This guide focuses on setting up a robust, scalable, and AI-ready development environment for Doc2HTML in 2025.

---

## 🏗️ Part 1: Environment & Tooling

### 1. Recommended Tooling
- **Node.js**: v20.x or higher (for native `fetch` and stable worker threads).
- **Package Manager**: `npm`, `pnpm`, or `bun`.
- **Editor**: VS Code with **GitHub Copilot** (for AI-assisted coding) and **ESLint**.

### 2. Environment Variables (.env)
Modern SaaS development requires strict environment separation.

**Backend (`backend/.env`):**
```env
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
MAX_FILE_SIZE=10485760 # 10MB
# Optional: AI API Keys
# OPENAI_API_KEY=sk-...
```

**Frontend (`frontend/.env`):**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_MAX_FILE_SIZE=10485760
REACT_APP_ENABLE_PPTX=true
```

---

## 🚀 Part 2: Backend Setup (AI Processing Node)

### 1. Clean Installation
```bash
cd backend
rm -rf node_modules # Optional: Fresh start
npm install
```

### 2. The Conversion Engine
Doc2HTML uses a modular approach. The core logic resides in `backend/backend_server.js`, but you can extend it by adding new converters in a `converters/` directory.

### 3. "Zero-Retention" Mode
In production, ensure your backend processes files in memory.
- **Development**: Files saved to `uploads/` for debugging.
- **Production**: Set `USE_IN_MEMORY_STORAGE=true` (future feature) to avoid disk I/O.

---

## 🎨 Part 3: Frontend Setup (React 18)

### 1. Installation
```bash
cd frontend
npm install
```

### 2. AI-Ready Components
The frontend is built to handle complex HTML output from the backend.
- Use the **Semantic Preview** component to visualize how an LLM sees the document.
- Ensure all components are responsive and WCAG 2.2 compliant.

---

## 🧪 Part 4: End-to-End Verification

1. **Start Backend**: `npm run dev` (uses nodemon).
2. **Start Frontend**: `npm start`.
3. **Run Health Check**: `curl http://localhost:5000/health`.
4. **Test Conversion**:
   - Upload `test-document.docx`.
   - Verify the presence of `<article>` and `<section>` tags in the preview.

---

## 🆘 Modern Troubleshooting

### "CORS Error"
Ensure `ALLOWED_ORIGINS` in your backend `.env` exactly matches your frontend URL (including protocol and port).

### "Node Version Incompatibility"
If you see errors related to `fs.promises` or `fetch`, ensure you are on Node.js 20+. Use `nvm use 20` to switch.

### "Memory Issues"
If converting extremely large PPTX files, increase the Node.js memory limit:
`NODE_OPTIONS="--max-old-space-size=4096" npm start`

---

## 🏁 Next Level: Agentic Extensions

Once the base is running, you can:
1. **Add LangChain Support**: Create a wrapper that allows LangChain agents to call your `/convert/docx` endpoint.
2. **Enable Webhooks**: Add a `webhook_url` parameter to the API to notify other services when a conversion is complete.

**Happy Building! 🚀**
