# Complete Setup Guide - AI Website Builder

## 🚀 QUICK START (5 minutes)

### Step 1: Clone & Install
```bash
git clone https://github.com/suhas883/ai-website-builder.git
cd ai-website-builder
npm install
```

### Step 2: Add Your Gemini API Key

**From previous setup, you have:**
- Project ID: `gen-lang-client-0811420861`
- Service Account: `bolt-dev-api@gen-lang-client-0811420861.iam.gserviceaccount.com`
- JSON Key Downloaded

**Create `.env.local`:**
```bash
# Copy your JSON key content
cp your-downloaded-key.json ./credentials.json

# Add to .env.local:
NEXT_PUBLIC_GOOGLE_PROJECT_ID=gen-lang-client-0811420861
NEXT_PUBLIC_GOOGLE_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=./credentials.json
GEMINI_MODEL=gemini-3-pro-preview
```

### Step 3: Run Locally
```bash
npm run dev
# Open http://localhost:3000
```

---

## 📁 File Structure to Create

Create these files in order:

### 1. `app/page.tsx` - Main IDE Page
```tsx
'use client';
import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Wand2, Download, Save, Play } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const DEFAULT_CODE = `<div style="text-align: center; padding: 50px;">
  <h1>Welcome to AI Website Builder</h1>
  <p>Describe what you want to build, click Generate!</p>
</div>`;

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState<'html' | 'jsx' | 'typescript'>('html');
  const [loading, setLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const generateCode = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, language }),
      });

      const data = await response.json();
      if (data.code) {
        setCode(data.code);
        toast.success('Code generated!');
      }
    } catch (error) {
      toast.error('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const updatePreview = () => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(code);
        doc.close();
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Toaster />
      {/* Sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">✨ AI Builder</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Describe your website:</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Create a beautiful landing page for a SaaS product..."
              className="w-full h-24 bg-gray-700 border border-gray-600 rounded p-2 text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Framework:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2"
            >
              <option value="html">HTML/CSS/JS</option>
              <option value="jsx">React JSX</option>
              <option value="typescript">TypeScript</option>
            </select>
          </div>

          <button
            onClick={generateCode}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <Wand2 size={18} />
            {loading ? 'Generating...' : 'Generate Code'}
          </button>

          <button
            onClick={updatePreview}
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <Play size={18} />
            Preview
          </button>

          <button
            onClick={() => {
              const element = document.createElement('a');
              element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(code));
              element.setAttribute('download', `project.${language === 'html' ? 'html' : 'jsx'}`);
              element.style.display = 'none';
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
              toast.success('Downloaded!');
            }}
            className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4">
        {/* Editor */}
        <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
          <Editor
            height="100%"
            defaultLanguage="html"
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
            }}
          />
        </div>

        {/* Preview */}
        <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
          <iframe
            ref={iframeRef}
            className="w-full h-full bg-white"
            title="preview"
            srcDoc={code}
          />
        </div>
      </div>
    </div>
  );
}
```

### 2. `app/api/generate/route.ts` - Gemini API Handler
```typescript
import { VertexAI } from '@google-cloud/vertexai';
import { NextRequest, NextResponse } from 'next/server';

const vertex_ai = new VertexAI({
  project: process.env.NEXT_PUBLIC_GOOGLE_PROJECT_ID!,
  location: process.env.NEXT_PUBLIC_GOOGLE_LOCATION!,
});

const model = vertex_ai.getGenerativeModel({
  model: process.env.GEMINI_MODEL || 'gemini-3-pro-preview',
});

export async function POST(request: NextRequest) {
  try {
    const { prompt, language } = await request.json();

    const systemPrompt = `You are an expert web developer. Generate ${language === 'html' ? 'HTML/CSS/JavaScript' : language === 'jsx' ? 'React JSX' : 'TypeScript'} code based on the user's description.
Only return the code, nothing else. No explanations, no markdown backticks.`;

    const response = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\nBuild: ${prompt}` }],
      }],
    });

    const code = response.response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return NextResponse.json({
      code: code.replace(/```\w+\n?|```\n?/g, '').trim(),
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Generation failed' },
      { status: 500 }
    );
  }
}
```

### 3. `app/layout.tsx` - Root Layout
```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Website Builder',
  description: 'Build websites with Gemini API',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### 4. `app/globals.css` - Styling
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #111827;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}
```

### 5. `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noImplicitAny": true,
    "resolveJsonModule": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

---

## 🚀 Deploy to Vercel

```bash
# 1. Push to GitHub
git add .
git commit -m "Add complete AI IDE"
git push origin main

# 2. Go to vercel.com → Import Git Repository
# 3. Select your repository
# 4. Add Environment Variables:
#    - NEXT_PUBLIC_GOOGLE_PROJECT_ID
#    - NEXT_PUBLIC_GOOGLE_LOCATION
#    - GEMINI_MODEL
#    - GOOGLE_APPLICATION_CREDENTIALS (paste JSON key content)
# 5. Deploy!
```

---

## ✅ Next Steps

1. Create the files above
2. Run `npm install`
3. Add `.env.local`
4. Run `npm run dev`
5. Test generate → download → upload to Vercel

**Your Replit alternative is ready!**
