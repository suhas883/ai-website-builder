import { NextRequest, NextResponse } from 'next/server';

const PROJECT_ID = process.env.NEXT_PUBLIC_GOOGLE_PROJECT_ID || 'gen-lang-client-0811420861';
const LOCATION = process.env.NEXT_PUBLIC_GOOGLE_LOCATION || 'us-central1';
const MODEL = 'gemini-3-pro-preview';

async function generateWithGemini(prompt: string, language: string) {
  const apiUrl = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL}:generateContent`;

  const systemPrompt = `You are an expert web developer. Generate ${language === 'html' ? 'HTML/CSS/JavaScript' : language === 'jsx' ? 'React JSX' : 'TypeScript'} code based on the user's description.
Only return the code, nothing else. No markdown, no explanations, no backticks. Just pure code.`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAccessToken()}`,
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${systemPrompt}\n\nBuild this: ${prompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 8000,
          temperature: 0.7,
        },
      }),
    });

    const data = await response.json();
    const code = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return code.replace(/```[\w]*\n?|```\n?/g, '').trim();
  } catch (error) {
    console.error('Gemini API Error:', error);
    return null;
  }
}

async function getAccessToken() {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        grant_type: 'refresh_token',
      }),
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Token Error:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, language } = await request.json();

    if (!prompt || !language) {
      return NextResponse.json(
        { error: 'Prompt and language are required' },
        { status: 400 }
      );
    }

    const code = await generateWithGemini(prompt, language);

    if (!code) {
      return NextResponse.json(
        { error: 'Failed to generate code' },
        { status: 500 }
      );
    }

    return NextResponse.json({ code });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
