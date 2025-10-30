# Quick Start Guide

Get your Twitter Transcript Generator running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, React, OpenAI SDK, and Tailwind CSS.

## Step 2: Get Your API Keys

### RapidAPI Key (for video extraction)

1. Go to [rapidapi.com](https://rapidapi.com/)
2. Sign up for a free account
3. Search for "Twitter Video Downloader"
4. Subscribe to a free plan
5. Copy your API key

### OpenAI API Key (users provide this)

Users will enter their own OpenAI API key in the UI. You don't need to provide this.

New OpenAI accounts get $18 in free credit: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

## Step 3: Configure Environment

Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your RapidAPI key:

```env
RAPIDAPI_KEY=your_rapidapi_key_here
```

## Step 4: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 5: Test It Out

1. Find a Twitter/X post with a video (make sure it's public)
2. Copy the URL (e.g., `https://x.com/username/status/1234567890`)
3. Get your OpenAI API key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
4. Paste both into the form
5. Click "Transcribe Video"
6. Wait 10-30 seconds
7. Copy the transcript!

## That's It!

Your Twitter Transcript Generator is now running locally.

## Common Issues

**"RAPIDAPI_KEY not configured"**
- Make sure you created `.env.local`
- Verify the key is correct
- Restart the dev server after adding the key

**"Invalid OpenAI API key"**
- Keys start with `sk-`
- Check for typos or extra spaces
- Verify the key is active

**"No video found in this tweet"**
- Ensure the tweet contains a video (not just images)
- Check that the tweet is public
- Try a different video post

## Next Steps

- Read [README.md](./README.md) for full documentation
- Check [FUNCTIONALITY.md](./FUNCTIONALITY.md) for technical details
- Customize the UI in `app/page.tsx`
- Add features or modify transcription options

## Need Help?

1. Check the browser console for errors
2. Review server logs in the terminal
3. Verify all API keys are valid
4. Test the health endpoint: `http://localhost:3000/api/transcribe`

Happy transcribing!
