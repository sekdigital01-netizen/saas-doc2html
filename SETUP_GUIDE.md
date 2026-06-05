# 🚀 Doc2HTML SaaS - Complete Setup Guide

## Quick Start (This Weekend!)

### Prerequisites
- Node.js (v16+) - Download from nodejs.org
- npm (comes with Node.js)
- VS Code or any code editor

---

## PART 1: Backend Setup (30 mins)

### Step 1: Create Backend Folder
```bash
mkdir doc2html-backend
cd doc2html-backend
npm init -y
```

### Step 2: Install Dependencies
```bash
npm install express multer mammoth cors dotenv
npm install --save-dev nodemon
```

### Step 3: Create `backend_server.js`
Copy the `backend_server.js` file you received into this folder.

### Step 4: Update `package.json`
Add this to `package.json`:
```json
"scripts": {
  "start": "node backend_server.js",
  "dev": "nodemon backend_server.js"
}
```

### Step 5: Create uploads folder
```bash
mkdir uploads
```

### Step 6: Run Backend
```bash
npm run dev
```

You should see:
```
🚀 Doc2HTML Server running on http://localhost:5000
```

**✅ Backend is ready!**

---

## PART 2: Frontend Setup (1 hour)

### Option A: Create React App (Easiest)

```bash
cd ..
npx create-react-app doc2html-frontend
cd doc2html-frontend
npm install axios
```

### Step 2: Replace App.js
1. Delete `src/App.js`
2. Copy the `Doc2HTML.jsx` file into `src/App.js`
3. Copy the `Doc2HTML.css` file into `src/App.css`

### Step 3: Create .env file (Edge Deployment Ready)
In `doc2html-frontend` folder, create `.env`:
```
# Local development URL
REACT_APP_API_URL=http://localhost:5000

# Edge Deployment Variables
REACT_APP_ENABLE_PPTX=false
REACT_APP_MAX_FILE_SIZE=10485760
```

### Step 4: Run Frontend
```bash
npm start
```

This opens http://localhost:3000 automatically!

**✅ Frontend is ready!**

---

## PART 3: Test It End-to-End

1. Make sure backend is running on port 5000
2. Make sure frontend is running on port 3000
3. Create a test Word document (.docx):
   - Open Microsoft Word or Google Docs
   - Write some text: "Hello World - Test Document"
   - Save as `test.docx`
4. Upload to the frontend at http://localhost:3000
5. Click "Convert to HTML"
6. You should see the HTML preview!

---

## DEPLOYMENT (Sunday - Free!)

### Deploy Backend to Railway (2 mins)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub"
5. Connect your `doc2html-backend` repo
6. It deploys automatically!
7. Copy the URL (like https://doc2html-backend.railway.app)

### Deploy Frontend to Vercel (2 mins)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Select your `doc2html-frontend` repo
5. In "Environment Variables", add:
   ```
   REACT_APP_API_URL=https://doc2html-backend.railway.app
   ```
6. Click Deploy!

**Your site is live! Share the URL with friends.**

---

## FILE STRUCTURE

```
doc2html-project/
├── doc2html-backend/
│   ├── backend_server.js
│   ├── package.json
│   └── uploads/
│
└── doc2html-frontend/
    ├── public/
    ├── src/
    │   ├── App.js (Doc2HTML.jsx)
    │   ├── App.css (Doc2HTML.css)
    │   └── index.js
    ├── package.json
    └── .env
```

---

## TROUBLESHOOTING

### "Backend not found" error
- Make sure backend is running: `npm run dev` in backend folder
- Check if it's on port 5000: http://localhost:5000/health

### "CORS error"
- Backend has CORS enabled, should work fine
- Make sure API URL is correct in .env

### File upload fails
- Check file size (max 10MB)
- Make sure it's a .docx file
- Check browser console for exact error

### Want to add more features?
See "NEXT FEATURES" section below

---

## NEXT FEATURES (MAKE MORE MONEY!)

### Week 2: User Accounts
```bash
npm install @supabase/supabase-js
```
- Sign up with email
- Track conversion history
- Set usage limits

### Week 3: Payments ($$$)
```bash
npm install @stripe/react-stripe-js
```
- Add Stripe payment button
- Charge $4.99/month for Pro
- Track conversions used

### Week 4: PPTX Support
```bash
npm install pptxjs
```
- Convert PowerPoint to HTML
- Show slides as grid or carousel
- Export slides as images

### Week 5: Advanced Features
- PDF support (use pdf2json)
- Email sending (use SendGrid)
- API for developers
- Google Sheets integration

---

## BUSINESS TIPS (Modern Trends)

### Pricing Strategy
- **Free**: 5 conversions/day, Semantic AI-Ready Preview
- **Pro**: $4.99/month, Unlimited WCAG 2.2 Downloads
- **AI-As-A-Service**: $29.99/month, High-volume API, RAG-optimized output

### Marketing (Get First 100 Users)
1. Post on Product Hunt
2. Share on dev.to, Reddit
3. Email 10 friends, ask them to share
4. Post on Twitter with demo GIF
5. Create simple YouTube tutorial (3 mins)

### Revenue Potential
- Get 100 users
- 20% conversion to Pro ($4.99 x 20 = $100/month)
- **$100/month passive income** 💰

---

## IMPORTANT FILES TO KEEP

- `backend_server.js` - Your conversion engine
- `Doc2HTML.jsx` - Your UI (rename to App.js)
- `Doc2HTML.css` - Your styling
- `.env` - Your environment variables

---

## NEED HELP?

1. Stack Overflow - Search your error
2. Mammoth.js docs - https://github.com/mwilson/mammoth.js
3. React docs - https://react.dev
4. Express docs - https://expressjs.com
5. Railway/Vercel docs - check their websites

---

## TIMELINE FOR SUCCESS

**Friday Evening (2 hours)**
- [ ] Setup backend with Node + Express
- [ ] Add mammoth.js library
- [ ] Test /convert/docx endpoint

**Saturday Morning (2 hours)**
- [ ] Setup React frontend
- [ ] Add file upload form
- [ ] Display converted HTML

**Saturday Afternoon (2 hours)**
- [ ] Add CSS styling
- [ ] Test entire flow
- [ ] Fix bugs

**Sunday (2 hours)**
- [ ] Deploy to Railway + Vercel
- [ ] Share with friends
- [ ] Get feedback
- [ ] Plan pricing/features

**By Monday morning: YOU HAVE A LIVE PRODUCT! 🎉**

---

## BONUS: Docker for Easy Deployment

Create `Dockerfile` in backend folder:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

Then deploy to any Docker service. But for MVP, Railway is easier!

---

**Good luck! You've got this! Drop a ⭐ if this guide helped 🚀**
