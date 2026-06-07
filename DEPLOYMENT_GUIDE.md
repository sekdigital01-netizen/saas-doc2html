# 🚀 Doc2HTML Deployment Guide: 2025 Edition

## 🌍 Modern Deployment Strategy

The goal for 2025 is to move processing as close to the user as possible. While traditional servers (Railway, Heroku) are stable, **Edge** and **Serverless** offer superior latency and cost-efficiency.

---

## 🛠️ Option 1: The Modern Edge Stack (Recommended)

### 1. Frontend: Vercel Edge
- **Platform**: [Vercel](https://vercel.com)
- **Deployment**: Connect your GitHub repo.
- **Config**: Ensure `REACT_APP_API_URL` points to your production backend.
- **Edge Functions**: Vercel automatically deploys React apps with global edge distribution.

### 2. Backend: Railway or Render (Serverless/Containers)
- **Platform**: [Railway](https://railway.app)
- **Benefits**: Perfect for the Node.js/Express backend. Automatic SSL, custom domains, and zero-downtime deploys.
- **Config**:
  - Add `NODE_ENV=production`
  - Add `ALLOWED_ORIGINS=https://your-frontend.vercel.app`
  - Set `PORT=5000` (Railway will map this automatically).

---

## ⚡ Option 2: The "Ultra-Low Latency" Edge (Advanced)

### 1. Cloudflare Workers
- **Target**: Deploying the conversion logic directly to [Cloudflare Workers](https://workers.cloudflare.com).
- **Strategy**: Refactor the conversion engine (Mammoth.js) to run in a Web Worker environment.
- **Benefit**: 0ms cold starts and global execution.

---

## 📦 Deployment Checklist

### 1. Environment Variables
Ensure the following are set in your production dashboard:
- **Backend**: `NODE_ENV`, `PORT`, `ALLOWED_ORIGINS`, `MAX_FILE_SIZE`.
- **Frontend**: `REACT_APP_API_URL`, `REACT_APP_MAX_FILE_SIZE`, `REACT_APP_ENABLE_PPTX`.

### 2. Security Headers
When deploying, ensure your hosting provider adds these headers:
- `Content-Security-Policy`: Restrict where scripts can be loaded from.
- `Strict-Transport-Security`: Force HTTPS.
- `X-Content-Type-Options`: Prevent MIME sniffing.

### 3. "Zero-Retention" Verification
In production, double-check that your backend is **NOT** writing files to disk.
- Verify `fs.unlinkSync` is called in the `finally` block of your controllers.
- (Optional) Use `MemoryStorage` with Multer to keep files entirely in RAM.

---

## 🔄 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml` to automate testing and deployment:

```yaml
name: CI/CD
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Test Backend
        run: cd backend && npm install && npm test
      - name: Test Frontend
        run: cd frontend && npm install && npm test
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    run: # Add your deployment CLI commands here (e.g., vercel deploy)
```

---

## 📈 Performance Monitoring

- **Vercel Analytics**: Monitor frontend load times and Web Vitals.
- **Logtail / Sentry**: Integrate with your backend to track conversion errors and latency.
- **Health Check**: Set up a ping service (e.g., UptimeRobot) to monitor `https://your-api.com/health`.

---

## 🆘 Troubleshooting Production

- **CORS Failures**: Verify that the protocol (`https://`) is included in your `ALLOWED_ORIGINS`.
- **Timeout Errors**: For very large documents, some serverless platforms have a 10s timeout. Increase this or move to a persistent container (Railway).
- **MIME Type Mismatch**: Ensure your client sends the correct `Content-Type` for DOCX and PPTX files.

**Built for speed. Scaled for the world. 🚀**
