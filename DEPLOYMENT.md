# 🚀 HOW TO RUN YOUR AI WEBSITE BUILDER IDE

## **STEP 1: Clone the Repository (5 seconds)**

```bash
git clone https://github.com/suhas883/ai-website-builder.git
cd ai-website-builder
```

## **STEP 2: Install Dependencies (1-2 minutes)**

```bash
npm install
```

## **STEP 3: Set Up Environment Variables (1 minute)**

Create a `.env.local` file in the root directory:

```bash
echo 'NEXT_PUBLIC_GOOGLE_PROJECT_ID=gen-lang-client-0811420861
NEXT_PUBLIC_GOOGLE_LOCATION=us-central1
GEMINI_MODEL=gemini-3-pro-preview' > .env.local
```

**OR** manually create `.env.local` and add:
```
NEXT_PUBLIC_GOOGLE_PROJECT_ID=gen-lang-client-0811420861
NEXT_PUBLIC_GOOGLE_LOCATION=us-central1
GEMINI_MODEL=gemini-3-pro-preview
```

## **STEP 4: Start Development Server (10 seconds)**

```bash
npm run dev
```

**OUTPUT:**
```
  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local
```

## **STEP 5: Open in Browser (instant)**

Go to: **http://localhost:3000**

✅ **Your IDE is now running!**

---

## 🎯 **WHAT YOU CAN DO NOW:**

1. **Left Sidebar:** Type your prompt ("Create a beautiful landing page")
2. **Select Framework:** HTML/CSS/JS, React, or TypeScript
3. **Click Generate:** AI generates website code using your Gemini API
4. **Live Preview:** See changes instantly on the right
5. **Edit Code:** Modify in Monaco Editor
6. **Export:** Download code or push to GitHub

---

## 🌐 **DEPLOY TO VERCEL (2 minutes)**

### **Option 1: Auto Deploy from GitHub**

1. Go to **vercel.com**
2. Click **Import Project**
3. Select your GitHub repo: `ai-website-builder`
4. Add Environment Variables:
   ```
   NEXT_PUBLIC_GOOGLE_PROJECT_ID=gen-lang-client-0811420861
   NEXT_PUBLIC_GOOGLE_LOCATION=us-central1
   GEMINI_MODEL=gemini-3-pro-preview
   ```
5. Click **Deploy**

**Live in ~30 seconds at:** `yourname.vercel.app`

### **Option 2: Deploy via CLI**

```bash
npm install -g vercel
vercel
# Follow the prompts, add environment variables, and deploy!
```

---

## 🔧 **Troubleshooting**

### Port 3000 Already in Use?
```bash
npm run dev -- -p 3001
# Opens at http://localhost:3001
```

### Missing Dependencies?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Need Gemini API Key?
You already have it configured in your Google Cloud Project:
- **Project ID:** `gen-lang-client-0811420861`
- **Model:** `gemini-3-pro-preview`
- **API:** Already enabled in your Cloud console

---

## 💡 **Key Features Ready to Use**

- ✨ **Monaco Editor** - Professional code editor
- 👀 **Live Preview** - Real-time rendering
- 🤖 **Gemini AI** - Generates code from prompts
- 📥 **Export** - Download or GitHub push
- 🎨 **Beautiful UI** - Dark theme, responsive
- ⚡ **Fast** - Next.js optimized
- 🚀 **Vercel Ready** - One-click deploy

---

## 📊 **Cost**

- **Monthly cost:** $0 (uses your Google Cloud free tier)
- **Free API calls:** Up to 1M tokens/month with Gemini
- **Vercel:** Free tier includes unlimited deployments

**You're building unlimited websites for free!**
