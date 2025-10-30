# GigaTrasscript

Extract and transcribe audio from Twitter/X video posts using OpenAI Whisper.

## Features

- 🎥 Extract videos from Twitter/X posts
- 🎤 Transcribe audio using OpenAI Whisper API
- 📝 Queue multiple videos for automatic processing
- 💾 Save API key locally in browser
- ✨ Beautiful glassmorphism UI with rainbow background
- 🔒 Privacy-focused: API key never leaves your browser

## Tech Stack

- Next.js 14
- TypeScript
- OpenAI Whisper API
- Tailwind CSS
- Three.js (ColorBends background)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Add your RapidAPI key to `.env.local`
5. Run the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Enter your OpenAI API key in Settings
2. Paste a Twitter/X video URL
3. Click "Add to Queue"
4. Wait for transcription to complete
5. View and copy your transcript

## License

MIT
