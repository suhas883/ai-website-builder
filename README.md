# AI Website Builder - Gemini-Powered IDE

A **Replit alternative** for building websites using Google's Gemini API. Code React, Angular, HTML/CSS/JS directly in your browser. **Vercel-ready** and self-hosted.

## Features

✅ **Monaco Editor** - Professional code editor with syntax highlighting  
✅ **Live Preview** - Real-time HTML/CSS/JS preview  
✅ **AI Generation** - Gemini API generates website code from prompts  
✅ **Multi-Framework** - React, Angular, Vue, HTML support  
✅ **Vercel Ready** - One-click deployment to Vercel  
✅ **GitHub Integration** - Auto-push code to GitHub  
✅ **No Costs** - Use your $300 Google Cloud free tier  

## Quick Start

### Prerequisites
- Node.js 18+
- Google Cloud Project with Vertex AI enabled
- Gemini API key (from your service account)

### Local Setup

```bash
# Clone the repo
git clone https://github.com/suhas883/ai-website-builder.git
cd ai-website-builder

# Install dependencies
npm install

# Create .env.local with your Gemini API details
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Run dev server
npm run dev

# Open http://localhost:3000
```

## Configuration

### Setup Gemini API

1. Go to Google Cloud Console
2. Enable Vertex AI API
3. Create Service Account → Download JSON key
4. Add to `.env.local`:

```env
NEXT_PUBLIC_GOOGLE_PROJECT_ID=your-project-id
NEXT_PUBLIC_GOOGLE_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=./credentials.json
GEMINI_MODEL=gemini-3-pro-preview
```

## Deploy to Vercel

```bash
# Push to GitHub
git push origin main

# Go to vercel.com → Import Git repository
# Add environment variables from .env.local
# Deploy!
```

## Usage

1. **Write Prompt**: Describe what you want to build
2. **Click Generate**: AI creates the code
3. **Edit Code**: Refine in the editor
4. **Preview Live**: See changes instantly
5. **Export**: Download or push to GitHub

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Editor**: Monaco Editor (VSCode)
- **AI**: Google Gemini 3 Pro Preview
- **Hosting**: Vercel
- **Database**: Optional (Firebase/Supabase)

## API Cost

With Google's $300 free tier:
- **Gemini API**: Free up to 1M tokens/month
- You can build **thousands of websites** before paying

## License

MIT - Use freely!

## Support

Issues? Star the repo and open an issue on GitHub.
