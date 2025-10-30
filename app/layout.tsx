import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Twitter Transcript Generator',
  description: 'Extract and transcribe audio from Twitter/X video posts using OpenAI Whisper',
  keywords: ['twitter', 'x', 'transcription', 'whisper', 'openai', 'video', 'audio'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
