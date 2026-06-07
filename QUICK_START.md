# 🚀 Doc2HTML SaaS - 2025 AI-Native Quick Start

## ⚡ Get Running in 2 Minutes

### 📋 Prerequisites
- **Node.js 20+** (LTS recommended)
- **NPM 10+** or **Bun 1.1+** (for faster installs)
- **VS Code** + **Prettier** extension

---

## 🛠️ Step 1: Backend Setup (AI Processing Node)

```bash
cd backend
# Use Bun for 5x faster installation if available
npm install
# Or: bun install

# Start the dev server with hot-reload
npm run dev
```

**Verification:**
- Open `http://localhost:5000/health`
- Expected: `{"status": "Server is running ✓", "environment": "development"}`

---

## 🎨 Step 2: Frontend Setup (RAG-Ready UI)

```bash
cd frontend
npm install
# Or: bun install

# Start the React dev server
npm start
```

**App Link:** `http://localhost:3000`

---

## 🧪 Step 3: Your First AI-Ready Conversion

1. **Locate** the `test-document.docx` in the root folder.
2. **Drag & Drop** it into the frontend upload zone.
3. **Click** "✨ Convert to HTML".
4. **Inspect**: Right-click the preview → "Inspect". Notice the semantic `<article>` and `<section>` tags optimized for LLMs.

---

## 💡 Modern Pro Tips

### 1. Environment Management
Use a `.env` file in both folders.
- **Backend**: `ALLOWED_ORIGINS=http://localhost:3000`
- **Frontend**: `REACT_APP_API_URL=http://localhost:5000`

### 2. Fast Switching
If you're using **NVM**, create a `.nvmrc` file in the root:
```bash
node -v > .nvmrc
# Then simply run:
nvm use
```

### 3. Debugging AI Output
Check the **Network Tab** in Chrome DevTools to see the raw JSON response from the backend. The `html` field contains the semantic structure that AI Agents use to navigate your document.

---

## 📦 Next Level: Deployment

| Platform | Role | Command |
|----------|------|---------|
| **Vercel** | Frontend & Edge | `vercel deploy` |
| **Railway** | Backend API | `railway up` |
| **Cloudflare** | DNS & Workers | `wrangler publish` |

---

## 📞 Support & Links
- 💰 **Monetization Guide**: `MONETIZATION_GUIDE.md`
- 🏗️ **Full Setup Guide**: `SETUP_GUIDE.md`
- ✅ **Testing Guide**: `TESTING_GUIDE.md`

**Ready to revolutionize document-to-AI conversion? Let's go! 🚀**
