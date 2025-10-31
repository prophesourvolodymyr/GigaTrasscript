# Twitter Transcript Generator - Functionality Documentation

## Overview
A simple, single-page Next.js application that extracts video from Twitter/X posts and transcribes the audio using OpenAI's Whisper API.

---

## Core Features

### 1. Simple One-Page Interface
- Clean, minimalist design
- Two input fields:
  - Twitter/X post URL input
  - OpenAI API key input (with visibility toggle)
- One action button: "Transcribe"
- Output area with transcript text
- One-click copy button for transcript

### 2. Video Extraction Pipeline
The app will extract video from Twitter/X posts using one of these methods:

#### **Option A: yt-dlp (Recommended for Self-Hosted)**
- **Pros**: Free, reliable, open-source
- **Cons**: Requires server with yt-dlp installed
- **Implementation**:
  - Server-side API route executes yt-dlp command
  - Downloads video temporarily to server
  - Passes video to Whisper API

#### **Option B: RapidAPI Twitter Video Downloader**
- **Pros**: No server dependencies, fast
- **Cons**: Requires API key (free tier available)
- **Implementation**:
  - Server-side API route calls RapidAPI
  - Gets video URL
  - Downloads video temporarily
  - Passes to Whisper API

#### **Option C: Direct Twitter API Extraction**
- **Pros**: Official method
- **Cons**: Requires Twitter API credentials, complex setup
- **Implementation**:
  - Use Twitter API with `extended_entities`
  - Extract video URL from response
  - Download and transcribe

**Recommended**: Start with **Option B (RapidAPI)** for MVP, migrate to **Option A (yt-dlp)** for production.

---

## Technical Architecture

### Technology Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (for simplicity)
- **API Integration**: OpenAI Whisper API
- **Video Extraction**: RapidAPI or yt-dlp

### File Structure
```
/app
  /page.tsx                    # Main UI component
  /api
    /transcribe
      /route.ts                # API endpoint for transcription workflow
  /components
    /TranscriptBox.tsx         # Display transcript with copy button
    /InputForm.tsx             # URL and API key inputs
/lib
  /videoExtractor.ts           # Video extraction logic
  /whisperClient.ts            # Whisper API client
  /types.ts                    # TypeScript types
/public
  # Assets
```

---

## User Flow

### Step-by-Step Process

1. **User Input**
   - User pastes Twitter/X video post URL
   - User pastes OpenAI API key
   - User clicks "Transcribe" button

2. **Frontend Validation**
   - Validate URL format (must be twitter.com or x.com)
   - Validate API key is not empty
   - Show loading state

3. **Backend Processing** (API Route: `/api/transcribe`)

   a. **Receive Request**
   ```typescript
   POST /api/transcribe
   Body: {
     twitterUrl: string,
     openaiApiKey: string
   }
   ```

   b. **Extract Video**
   - Parse Twitter URL to get tweet ID
   - Use video extraction method (RapidAPI/yt-dlp)
   - Download video to temporary file
   - Handle errors (invalid URL, video not found, private video)

   c. **Download Video** (if using API method)
   - Fetch video file from extracted URL
   - Save temporarily to `/tmp` directory
   - Limit file size (max 25MB for Whisper API)

   d. **Transcribe Audio**
   - Create FormData with video file
   - Call OpenAI Whisper API:
     ```typescript
     const transcription = await openai.audio.transcriptions.create({
       file: videoFile,
       model: "whisper-1",
       language: "en", // or auto-detect
       response_format: "text"
     });
     ```
   - Handle API errors (invalid key, quota exceeded)

   e. **Cleanup**
   - Delete temporary video file
   - Return transcript to frontend

4. **Display Results**
   - Show transcript in readable format
   - Enable copy button
   - Show success message

5. **Copy Functionality**
   - Single click copies entire transcript to clipboard
   - Show "Copied!" confirmation

---

## API Endpoints

### POST `/api/transcribe`

**Request Body:**
```typescript
{
  twitterUrl: string;      // e.g., "https://x.com/username/status/1234567890"
  openaiApiKey: string;    // User's OpenAI API key
}
```

**Response (Success):**
```typescript
{
  success: true;
  transcript: string;
  duration?: number;       // Video duration in seconds (optional)
}
```

**Response (Error):**
```typescript
{
  success: false;
  error: string;
  errorCode?: string;      // e.g., "INVALID_URL", "VIDEO_NOT_FOUND", "API_ERROR"
}
```

---

## Data Flow Diagram

```
User Input (URL + API Key)
         ↓
    Frontend Validation
         ↓
    POST /api/transcribe
         ↓
    Extract Video URL
    (RapidAPI/yt-dlp)
         ↓
    Download Video
    (Temporary Storage)
         ↓
    Transcribe with Whisper
    (OpenAI API)
         ↓
    Delete Temp File
         ↓
    Return Transcript
         ↓
    Display + Copy Button
```

---

## Implementation Details

### 1. Video Extraction Logic (`/lib/videoExtractor.ts`)

```typescript
export async function extractTwitterVideo(tweetUrl: string): Promise<string> {
  // Parse tweet ID from URL
  const tweetId = parseTweetId(tweetUrl);

  // Method 1: RapidAPI
  const response = await fetch('https://twitter-downloader-api.p.rapidapi.com/', {
    method: 'POST',
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'twitter-downloader-api.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url: tweetUrl })
  });

  const data = await response.json();
  return data.video_url; // URL to video file
}
```

### 2. Whisper API Client (`/lib/whisperClient.ts`)

```typescript
import OpenAI from 'openai';
import fs from 'fs';

export async function transcribeAudio(
  videoPath: string,
  apiKey: string
): Promise<string> {
  const openai = new OpenAI({ apiKey });

  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(videoPath),
    model: "whisper-1",
    language: "en", // Auto-detect or specific language
  });

  return transcription.text;
}
```

### 3. Main API Route (`/app/api/transcribe/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { extractTwitterVideo } from '@/lib/videoExtractor';
import { transcribeAudio } from '@/lib/whisperClient';
import { downloadFile, cleanupFile } from '@/lib/fileUtils';
import path from 'path';

export async function POST(request: NextRequest) {
  const tempFiles: string[] = [];

  try {
    // 1. Parse request
    const { twitterUrl, openaiApiKey } = await request.json();

    // 2. Validate inputs
    if (!twitterUrl || !openaiApiKey) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 3. Extract video URL
    const videoUrl = await extractTwitterVideo(twitterUrl);

    // 4. Download video to temp file
    const tempVideoPath = path.join('/tmp', `twitter-video-${Date.now()}.mp4`);
    await downloadFile(videoUrl, tempVideoPath);
    tempFiles.push(tempVideoPath);

    // 5. Transcribe
    const transcript = await transcribeAudio(tempVideoPath, openaiApiKey);

    // 6. Cleanup
    await Promise.all(tempFiles.map(file => cleanupFile(file)));

    // 7. Return result
    return NextResponse.json({
      success: true,
      transcript
    });

  } catch (error: any) {
    // Cleanup on error
    await Promise.all(tempFiles.map(file => cleanupFile(file)));

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Transcription failed',
        errorCode: error.code
      },
      { status: 500 }
    );
  }
}
```

### 4. Frontend Component (`/app/page.tsx`)

```typescript
'use client';

import { useState } from 'react';

export default function Home() {
  const [twitterUrl, setTwitterUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTranscribe = async () => {
    setLoading(true);
    setError('');
    setTranscript('');

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ twitterUrl, openaiApiKey: apiKey })
      });

      const data = await response.json();

      if (data.success) {
        setTranscript(data.transcript);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError('Failed to transcribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(transcript);
    // Show success toast
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Twitter Transcript Generator</h1>

        {/* URL Input */}
        <input
          type="text"
          placeholder="Paste Twitter/X video post URL..."
          value={twitterUrl}
          onChange={(e) => setTwitterUrl(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        />

        {/* API Key Input */}
        <input
          type="password"
          placeholder="Paste your OpenAI API key..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        />

        {/* Transcribe Button */}
        <button
          onClick={handleTranscribe}
          disabled={loading || !twitterUrl || !apiKey}
          className="w-full bg-blue-600 text-white p-3 rounded disabled:bg-gray-300"
        >
          {loading ? 'Transcribing...' : 'Transcribe'}
        </button>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Transcript Display */}
        {transcript && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Transcript</h2>
              <button
                onClick={handleCopy}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Copy
              </button>
            </div>
            <div className="p-4 bg-gray-50 rounded border">
              {transcript}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
```

---

## Error Handling

### Common Errors and Solutions

1. **Invalid Twitter URL**
   - Error: "Invalid Twitter/X URL format"
   - Solution: Validate URL format before API call

2. **Video Not Found**
   - Error: "No video found in this post"
   - Solution: Check if tweet contains video, handle gracefully

3. **Private/Protected Video**
   - Error: "Cannot access private video"
   - Solution: Inform user video must be public

4. **Video Too Large**
   - Error: "Video exceeds 25MB limit"
   - Solution: Whisper API has file size limits

5. **Invalid OpenAI API Key**
   - Error: "Invalid API key"
   - Solution: Validate key format, show helpful error

6. **Rate Limit Exceeded**
   - Error: "API rate limit exceeded"
   - Solution: Show user-friendly message with retry suggestion

7. **Network Issues**
   - Error: "Failed to download video"
   - Solution: Retry logic with exponential backoff

---

## Security Considerations

1. **API Key Storage**
   - Never store user's OpenAI API key
   - Use it only for the request, then discard
   - Warn users about API key security

2. **Rate Limiting**
   - Implement rate limiting per IP
   - Prevent abuse of server resources

3. **Input Validation**
   - Validate all inputs server-side
   - Sanitize URLs to prevent injection

4. **File Storage**
   - Store temp files with random names
   - Auto-delete after processing
   - Implement cleanup cron job for orphaned files

5. **Environment Variables**
   - Store RapidAPI key in `.env.local`
   - Never expose server-side keys to frontend

---

## Performance Optimization

1. **Streaming Response**
   - Show progress indicator during processing
   - Consider streaming transcript as it's generated (if using streaming mode)

2. **Caching**
   - Cache transcripts by tweet URL (optional)
   - Reduce redundant API calls

3. **Video Size Limits**
   - Warn users about large videos
   - Show estimated processing time

4. **Concurrent Requests**
   - Limit concurrent transcriptions
   - Queue requests if needed

---

## Environment Variables Required

Create a `.env.local` file:

```env
# Optional: For RapidAPI video extraction
RAPIDAPI_KEY=your_rapidapi_key_here

# Optional: For Twitter API method
TWITTER_BEARER_TOKEN=your_twitter_bearer_token

# Node environment
NODE_ENV=development
```

**Note**: User provides OpenAI API key via UI

---

## Deployment Considerations

### Vercel (Recommended for Next.js)
- **Pros**: Easy deployment, serverless functions
- **Cons**:
  - Serverless functions have 50MB size limit
  - Execution timeout (10s on Hobby, 60s on Pro)
  - May need to use external storage for large videos

### Self-Hosted (VPS/Cloud)
- **Pros**: Full control, can install yt-dlp
- **Cons**: More maintenance, need to manage server

### Docker Container
- **Pros**: Portable, can include yt-dlp
- **Cons**: Need container hosting

**Recommendation**: Start with Vercel for MVP, migrate to self-hosted if needed.

---

## Future Enhancements (Out of Scope for MVP)

1. **Multi-language Support**
   - Auto-detect video language
   - Support multiple languages

2. **Video Preview**
   - Show thumbnail before transcription
   - Display video duration

3. **Transcript Formatting**
   - Add timestamps
   - Speaker detection
   - Paragraph breaks

4. **Export Options**
   - Download as TXT, PDF, SRT
   - Share via link

5. **Batch Processing**
   - Multiple URLs at once
   - Upload video files directly

6. **User Accounts**
   - Save API keys (encrypted)
   - View transcription history

7. **Alternative Transcription Services**
   - Support AssemblyAI, Deepgram
   - Compare pricing/quality

---

## Cost Estimation

### Per Transcription

**OpenAI Whisper API:**
- $0.006 per minute of audio
- Average 5-minute video = $0.03

**RapidAPI (if used):**
- Free tier: 50 requests/month
- Paid: ~$0.001 per request

**Total**: ~$0.03 per transcription (plus minimal compute)

---

## Testing Checklist

- [ ] Valid Twitter video URL works
- [ ] Invalid URL shows error
- [ ] Tweet without video shows error
- [ ] Invalid API key shows error
- [ ] Large video (>25MB) shows error
- [ ] Private video shows error
- [ ] Copy button works
- [ ] Loading states display correctly
- [ ] Error messages are user-friendly
- [ ] Temp files are cleaned up
- [ ] Rate limiting works
- [ ] Mobile responsive design

---

## Getting Started

### Prerequisites
- Node.js 18+
- OpenAI API account (user provides key)
- RapidAPI account (optional, for video extraction)

### Installation
```bash
npm install
npm run dev
```

### Required Dependencies
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "openai": "^4.0.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0"
  }
}
```

---

## Summary

This Twitter Transcript Generator is designed to be:
- **Simple**: One-page interface, minimal features
- **Secure**: API keys handled safely
- **Fast**: Optimized video extraction and transcription
- **User-friendly**: Clear errors, one-click copy
- **Scalable**: Can be enhanced with additional features

The core functionality focuses on delivering transcripts quickly and reliably, making it easy for users to extract text from Twitter videos with minimal friction.

---

**LET'S BUILD THIS! 🚀**
