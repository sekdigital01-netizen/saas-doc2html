# 📋 Doc2HTML Testing & QA Guide: AI-Ready Verification

This guide outlines modern testing strategies to ensure that Doc2HTML produces high-quality, semantic, and AI-optimized output.

---

## 🧪 Phase 1: Core Functionality (Manual & Automated)

### 1. Backend API Verification
Run these tests to ensure the conversion engine is stable.
- **Health Check**: `GET /health` → Should return `200 OK`.
- **DOCX Conversion**: `POST /convert/docx` → Should return `200 OK` with `html` string.
- **File Validation**:
  - Upload `.txt` → Should return `400 Invalid file type`.
  - Upload `15MB file` → Should return `400 File size exceeds limit`.

### 2. Frontend E2E Verification
- **Page Load**: Check for errors in the browser console (F12).
- **Drag & Drop**: Verify the UI updates when a file is dropped.
- **Preview Rendering**: Ensure the HTML preview is readable and formatted.
- **Download**: Verify the downloaded `.html` file opens in a browser.

---

## 🤖 Phase 2: AI-Ready Verification (2025 Focus)

In the AI era, "it looks right" is not enough. The output must "be right" for LLMs.

### 1. Semantic Integrity Check
- **Tool**: Right-click preview → **Inspect**.
- **Success Criteria**:
  - Does it use `<article>` as the root wrapper?
  - Are headers structured logically (`<h1>`, `<h2>`, etc.)?
  - Are slides (in PPTX) wrapped in `<section>` tags?
  - Are lists using `<ul>`/`<li>` instead of plain text with bullets?

### 2. RAG (Retrieval-Augmented Generation) Testing
- **Goal**: Ensure the HTML is easily chunkable for AI embeddings.
- **Test**: Paste the generated HTML into an LLM (e.g., GPT-4 or Claude).
- **Ask**: *"Summarize the hierarchy and key points of this document."*
- **Success**: If the LLM accurately identifies sections, headers, and bullet points without confusion.

---

## ♿ Phase 3: Accessibility & Standards (WCAG 2.2)

### 1. Lighthouse Audit
- Run the **Chrome Lighthouse Audit** (Accessibility tab).
- **Target**: Score of **95+**.
- **Focus**: Proper ARIA labels, color contrast, and semantic tagging.

### 2. Screen Reader Test
- Use **NVDA** (Windows) or **VoiceOver** (Mac).
- **Success**: The reader should navigate by headers and sections smoothly.

---

## 📦 Phase 4: Performance & Edge Testing

### 1. Memory Leak Check (Backend)
- Run the backend and perform 100 conversions in a loop.
- **Tool**: `node --inspect backend_server.js` + Chrome DevTools Memory tab.
- **Success**: RSS memory should return to baseline after conversions finish (Zero-Retention verification).

### 2. Latency Benchmarks
- **Target**: Conversion of a 10-page DOCX in **< 1 second**.
- **Edge Test**: Verify latency from different global regions using a VPN.

---

## 🔄 Modern QA Workflow

1. **Pre-push**: Run `npm test` in both directories.
2. **Review**: Check the **Semantic Preview** for any structural regressions.
3. **Automated CI**: GitHub Actions must pass before merging to `main`.

---

## 🆘 Troubleshooting QA Failures

- **"Malformed HTML"**: Check the `mammoth` style map in the backend. Ensure custom styles are mapped to semantic tags.
- **"Slow Conversion"**: Monitor CPU usage. PPTX conversion might need to be moved to a dedicated worker thread or optimized.
- **"AI Parsing Errors"**: If an LLM misinterprets the document, simplify the HTML output and remove redundant styling attributes.

**Quality is the difference between a tool and a solution. 🚀**
