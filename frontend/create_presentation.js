const PptxGenJS = require("pptxgenjs");

const prs = new PptxGenJS();
prs.defineLayout({ name: "LAYOUT1", width: 10, height: 7.5 });
prs.defineLayout({ name: "LAYOUT2", width: 10, height: 7.5 });

const colorScheme = {
  primary: "0F3460",      // Deep Navy
  secondary: "16213E",    // Darker Navy
  accent: "00D9FF",       // Cyan
  success: "00FF88",      // Neon Green
  text: "FFFFFF",
  lightText: "E8E8E8",
  bgDark: "0A1628"
};

function addTitle(prs, title, subtitle = "") {
  const slide = prs.addSlide();
  slide.background = { color: colorScheme.primary };
  
  slide.addText(title, {
    x: 0.5, y: 2.5, w: 9, h: 1.5,
    fontSize: 54, bold: true, color: colorScheme.accent,
    fontFace: "Arial", align: "center"
  });
  
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.5, y: 4.2, w: 9, h: 0.8,
      fontSize: 28, color: colorScheme.lightText,
      fontFace: "Arial", align: "center"
    });
  }
  
  return slide;
}

function addContentSlide(prs, title, content) {
  const slide = prs.addSlide();
  slide.background = { color: colorScheme.bgDark };
  
  // Title bar
  slide.addShape(prs.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 0.8,
    fill: { color: colorScheme.primary },
    line: { type: "none" }
  });
  
  slide.addText(title, {
    x: 0.5, y: 0.15, w: 9, h: 0.5,
    fontSize: 40, bold: true, color: colorScheme.accent,
    fontFace: "Arial"
  });
  
  // Content area
  slide.addText(content, {
    x: 0.7, y: 1.2, w: 8.6, h: 5.8,
    fontSize: 18, color: colorScheme.lightText,
    fontFace: "Arial", align: "left", valign: "top"
  });
  
  return slide;
}

// Slide 1: Title
addTitle(prs, "Doc2HTML SaaS", "Build Your First Weekend Project");

// Slide 2: The Opportunity
addContentSlide(prs, "The Opportunity 💰", 
`• PDF Converters: $100-500/week ✓
• Video Downloaders: $150-400/week ✓
• Doc Converters: Low competition, HIGH demand ✓

YOUR IDEA:
Word (.docx) → HTML for browsers
PowerPoint (.pptx) → HTML preview

Why it works:
✓ No complex video processing
✓ No storage hassles
✓ Businesses need this NOW
✓ Easy to monetize`);

// Slide 3: Business Model
const slide3 = prs.addSlide();
slide3.background = { color: colorScheme.bgDark };
slide3.addShape(prs.ShapeType.rect, {
  x: 0, y: 0, w: 10, h: 0.8,
  fill: { color: colorScheme.primary }
});
slide3.addText("Monetization Model 💵", {
  x: 0.5, y: 0.15, w: 9, h: 0.5,
  fontSize: 40, bold: true, color: colorScheme.accent,
  fontFace: "Arial"
});

// Left column
slide3.addShape(prs.ShapeType.rect, {
  x: 0.5, y: 1.2, w: 4.2, h: 5.8,
  fill: { color: colorScheme.secondary }
});
slide3.addText("🎁 FREE TIER\n\n• 5 conversions/day\n• Basic HTML output\n• No download\n• Shows watermark", {
  x: 0.7, y: 1.4, w: 3.8, h: 2.5,
  fontSize: 16, color: colorScheme.accent, bold: true,
  fontFace: "Arial"
});

// Right column
slide3.addShape(prs.ShapeType.rect, {
  x: 5.3, y: 1.2, w: 4.2, h: 5.8,
  fill: { color: colorScheme.secondary }
});
slide3.addText("💎 PRO TIER ($5/mo)\n\n• Unlimited conversions\n• Download as HTML\n• No watermark\n• API access\n• Email support", {
  x: 5.5, y: 1.4, w: 3.8, h: 2.5,
  fontSize: 16, color: colorScheme.success, bold: true,
  fontFace: "Arial"
});

// Slide 4: Tech Stack
const slide4 = prs.addSlide();
slide4.background = { color: colorScheme.bgDark };
slide4.addShape(prs.ShapeType.rect, {
  x: 0, y: 0, w: 10, h: 0.8,
  fill: { color: colorScheme.primary }
});
slide4.addText("The Tech Stack (Easy!) 🛠️", {
  x: 0.5, y: 0.15, w: 9, h: 0.5,
  fontSize: 40, bold: true, color: colorScheme.accent,
  fontFace: "Arial"
});

const techItems = [
  "Frontend: React + Tailwind CSS",
  "Backend: Node.js + Express",
  "Conversion: mammoth.js (DOCX) + pptxjs (PPTX)",
  "Database: Supabase (free tier = $0)",
  "Hosting: Vercel (free tier) + Railway",
  "Auth: Clerk or Auth0 (free tier)",
  "Payments: Stripe (2.9% fee only when paid)"
];

let yPos = 1.3;
techItems.forEach((item, idx) => {
  slide4.addText("✓", {
    x: 0.7, y: yPos, w: 0.4, h: 0.4,
    fontSize: 20, color: colorScheme.success, bold: true
  });
  
  slide4.addText(item, {
    x: 1.3, y: yPos - 0.05, w: 7.5, h: 0.45,
    fontSize: 17, color: colorScheme.lightText,
    fontFace: "Arial"
  });
  
  yPos += 0.75;
});

// Slide 5: How It Works
addContentSlide(prs, "How It Works 🎯",
`STEP 1: User uploads .docx or .pptx file
↓
STEP 2: Backend receives file

STEP 3: Convert to HTML
• mammoth.js for .docx → clean HTML
• pptxjs for .pptx → slide HTML

STEP 4: Display in browser (styled nicely!)

STEP 5: 
✓ Free users: watermark + no download
✓ Pro users: download as HTML`);

// Slide 6: MVP Features (Week 1)
addContentSlide(prs, "MVP for This Weekend 🚀",
`DON'T build everything. Focus on:

MUST HAVE:
✓ Upload .docx file
✓ Convert to HTML
✓ Display in browser
✓ Basic styling

NICE TO HAVE (after):
• PPTX support
• Download HTML
• User accounts
• Payment system

Timeline: 6-8 hours total`);

// Slide 7: Code Overview
const slide7 = prs.addSlide();
slide7.background = { color: colorScheme.bgDark };
slide7.addShape(prs.ShapeType.rect, {
  x: 0, y: 0, w: 10, h: 0.8,
  fill: { color: colorScheme.primary }
});
slide7.addText("Code Architecture 📐", {
  x: 0.5, y: 0.15, w: 9, h: 0.5,
  fontSize: 40, bold: true, color: colorScheme.accent,
  fontFace: "Arial"
});

slide7.addShape(prs.ShapeType.rect, {
  x: 0.7, y: 1.2, w: 8.6, h: 5.3,
  fill: { color: colorScheme.secondary },
  line: { color: colorScheme.accent, width: 2 }
});

slide7.addText(
`FRONTEND (React)
  ↓ File Upload
  ↓ Display preview
  
BACKEND (Node.js)
  ↓ Receive file
  ↓ Use mammoth.js to convert
  ↓ Return HTML
  
DATABASE (Optional for MVP)
  ↓ Store conversion history
  
HOSTING
  ↓ Vercel (frontend)
  ↓ Railway (backend)`, {
  x: 1.1, y: 1.5, w: 7.8, h: 4.7,
  fontSize: 17, color: colorScheme.accent, bold: true,
  fontFace: "Courier New"
});

// Slide 8: Step by Step
addContentSlide(prs, "Step-by-Step Guide 👇",
`WEEKEND SCHEDULE:

Friday Evening (2 hours):
✓ Setup Node.js + Express backend
✓ Add mammoth.js library
✓ Create upload endpoint

Saturday Morning (2 hours):
✓ Create React frontend
✓ Add file upload form
✓ Display converted HTML

Saturday Afternoon (2 hours):
✓ Add styling (Tailwind)
✓ Test & debug
✓ Deploy to Vercel + Railway

Sunday: Polish & Marketing 🎉`);

// Slide 9: Where to Deploy
const slide9 = prs.addSlide();
slide9.background = { color: colorScheme.bgDark };
slide9.addShape(prs.ShapeType.rect, {
  x: 0, y: 0, w: 10, h: 0.8,
  fill: { color: colorScheme.primary }
});
slide9.addText("Free Deployment (No Credit Card!) 🌐", {
  x: 0.5, y: 0.15, w: 9, h: 0.5,
  fontSize: 40, bold: true, color: colorScheme.accent,
  fontFace: "Arial"
});

const deployItems = [
  { service: "Frontend", location: "Vercel.com", cost: "Free (up to 100 GB/mo)" },
  { service: "Backend", location: "Railway.app", cost: "Free ($5/mo credit)" },
  { service: "Database", location: "Supabase.com", cost: "Free (500 MB)" },
  { service: "Domain", location: "Namecheap", cost: "$0.99 first year" }
];

let yPos2 = 1.4;
deployItems.forEach((item) => {
  slide9.addShape(prs.ShapeType.rect, {
    x: 0.7, y: yPos2, w: 8.6, h: 0.85,
    fill: { color: colorScheme.secondary }
  });
  
  slide9.addText(item.service, {
    x: 1.0, y: yPos2 + 0.1, w: 2.0, h: 0.65,
    fontSize: 15, bold: true, color: colorScheme.success,
    fontFace: "Arial"
  });
  
  slide9.addText(item.location, {
    x: 3.2, y: yPos2 + 0.1, w: 2.5, h: 0.65,
    fontSize: 15, color: colorScheme.accent,
    fontFace: "Arial"
  });
  
  slide9.addText(item.cost, {
    x: 6.0, y: yPos2 + 0.1, w: 2.3, h: 0.65,
    fontSize: 14, color: colorScheme.lightText,
    fontFace: "Arial"
  });
  
  yPos2 += 1.0;
});

// Slide 10: Resources
addContentSlide(prs, "Resources & Links 📚",
`Tutorials:
• Mammoth.js docs: cloudconvert.com/mammoth
• React upload tutorial: youtu.be/S6uTWe6z8...

Libraries (copy-paste ready):
• npm install mammoth express multer
• npm install pptxjs (for PowerPoint later)

Alternatives if stuck:
• Use Cloudinary for file hosting
• Use AWS Lambda for conversion (free tier)
• Discord community for help

START CODING NOW! 🚀`);

// Slide 11: Your Next Steps
addTitle(prs, "Your Action Plan", "Let's build this weekend!");

// Slide 12: Final Motivation
const slide12 = prs.addSlide();
slide12.background = { color: colorScheme.accent };
slide12.addText("Reality Check: You Got This! 💪", {
  x: 0.5, y: 1.5, w: 9, h: 1.2,
  fontSize: 52, bold: true, color: colorScheme.primary,
  fontFace: "Arial", align: "center"
});

slide12.addText(
`Your friends built simpler things (video downloading is harder!)
You only need to convert files to HTML
No complex servers, no video processing
Framework: React (you know this)
Libraries: 3 npm packages max

By Sunday: You'll have a working product ✓
By Next Month: You'll be making money ✓`, {
  x: 0.7, y: 3.0, w: 8.6, h: 3.5,
  fontSize: 18, color: colorScheme.primary,
  fontFace: "Arial", align: "center", valign: "middle", bold: true
});

prs.writeFile({ fileName: "test-presentation.pptx" });
console.log("✅ PowerPoint created successfully!");
