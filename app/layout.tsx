import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BuilderAI - AI Website Generator',
  description: 'Generate beautiful websites with AI using Gemini API',
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
