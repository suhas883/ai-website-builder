'use client';
import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Wand2, Download, Play, Github } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const DEFAULT_CODE = `<!DOCTYPE html>
<html>
<head>
  <title>AI Builder</title>
  <style>
    * { margin: 0; padding: 0; }
    body { font-family: sans-serif; background: #f0f0f0; }
    .container { max-width: 1200px; margin: 50px auto; padding: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to AI Website Builder</h1>
    <p>Describe what you want to build, then click Generate!</p>
  </div>
</body>
</html>`;

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
        toast.success('✨ Code generated!');
        updatePreview(data.code);
      } else {
        toast.error(data.error || 'Generation failed');
      }
    } catch (error) {
      toast.error('API Error');
    } finally {
      setLoading(false);
    }
  };

  const updatePreview = (htmlCode: string) => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(htmlCode);
        doc.close();
      }
    }
  };

  const downloadCode = () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(code));
    element.setAttribute('download', `website.${language === 'html' ? 'html' : 'jsx'}`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Downloaded! 📥');
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <Toaster position="top-center" />
      
      {/* Sidebar */}
      <div className="w-80 bg-gradient-to-b from-gray-900 to-gray-950 border-r border-gray-800 p-6 overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">✨ BuilderAI</h1>
          <p className="text-gray-400 text-sm mt-1">AI-Powered Website Generator</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">Your Idea:</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Create a beautiful landing page for a SaaS product with hero section and pricing..."
              className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">Framework:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="html">HTML/CSS/JS</option>
              <option value="jsx">React</option>
              <option value="typescript">TypeScript</option>
            </select>
          </div>

          <button
            onClick={generateCode}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105"
          >
            <Wand2 size={18} />
            {loading ? 'Generating...' : 'Generate'}
          </button>

          <button
            onClick={() => updatePreview(code)}
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition"
          >
            <Play size={16} />
            Preview
          </button>

          <button
            onClick={downloadCode}
            className="w-full bg-gray-800 hover:bg-gray-700 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition border border-gray-700"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex gap-4 p-4">
        {/* Code Editor */}
        <div className="flex-1 bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
          <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
            <p className="text-sm font-medium text-gray-300">Code Editor</p>
          </div>
          <Editor
            height="100%"
            defaultLanguage="html"
            language={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              wordWrap: 'on',
              automaticLayout: true,
              padding: { top: 10, bottom: 10 },
            }}
          />
        </div>

        {/* Live Preview */}
        <div className="flex-1 bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
          <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
            <p className="text-sm font-medium text-gray-300">Live Preview</p>
          </div>
          <iframe
            ref={iframeRef}
            className="w-full h-full bg-white"
            title="preview"
            srcDoc={code}
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  );
}
