# RapidAPI Setup Guide

If you're getting 403 errors, it means your RapidAPI key isn't subscribed to the right API. Follow this guide:

## Option 1: Subscribe to Twitter Video Downloader API (Recommended)

### Step-by-Step:

1. **Go to RapidAPI Hub**
   - Visit: https://rapidapi.com/hub

2. **Search for Twitter Video Downloader**
   - In the search bar, type: "Twitter Video Downloader"
   - Look for APIs with FREE tiers

3. **Choose One of These APIs:**

   **Option A: "Twitter Video Downloader"**
   - URL: https://rapidapi.com/PrestigeLimited/api/twitter-video-downloader-download-twitter-videos-gifs-and-images
   - Free Plan: 50 requests/month
   - Click "Subscribe to Test"
   - Select "Basic" (FREE) plan

   **Option B: "Social Media Video Downloader"**
   - URL: https://rapidapi.com/social-media-video-downloader/api/social-media-video-downloader
   - Free Plan: Available
   - Click "Subscribe to Test"
   - Select FREE plan

4. **Copy Your API Key**
   - After subscribing, scroll to "Code Snippets"
   - Find `X-RapidAPI-Key` in the example
   - Copy your key (different from the one you have now)

5. **Update Your `.env.local` File**
   ```env
   RAPIDAPI_KEY=your_new_key_here
   ```

6. **Restart the App**
   ```bash
   # Stop the current server (Ctrl+C in terminal)
   npm run dev
   ```

## Option 2: Use Free Fallback (No RapidAPI Needed)

The app now has **free fallback methods** built-in!

If RapidAPI fails, it will automatically try:
- Public Twitter video downloaders
- No API key required
- Works for most public tweets

**Note:** Free methods are less reliable and may break if services change.

## Option 3: Remove RapidAPI Requirement (Advanced)

If you don't want to use RapidAPI at all, you can:

1. Comment out RapidAPI code in `lib/videoExtractor.ts`
2. Only use the free fallback methods
3. Or install `yt-dlp` on your server (most reliable)

## Verifying Your Setup

Test your API key:

1. Go to: https://rapidapi.com/developer/apps
2. Click on your app
3. Check "Subscriptions" tab
4. Verify you're subscribed to a Twitter Video Downloader API

## Common Issues

**"Request failed with status code 403"**
- Your key isn't subscribed to the API we're calling
- Follow Option 1 above to subscribe to the correct API

**"Invalid RapidAPI key"**
- Check for typos in `.env.local`
- Make sure there are no extra spaces
- Restart the server after changing `.env.local`

**"Rate limit exceeded"**
- You've used all your free requests
- Wait until next month
- Or upgrade to a paid plan
- Or use the free fallback methods

## Recommended Setup

For best results:
1. Subscribe to **one** Twitter Video Downloader API on RapidAPI (free tier)
2. Keep the free fallback methods as backup
3. This gives you 50+ transcriptions per month for free

## Need Help?

If you're still having issues:
1. Check the server logs for detailed error messages
2. Verify your RapidAPI subscriptions
3. Try the free fallback methods
4. Use a different Twitter video post (make sure it's public)

## Cost Breakdown

**Free Tier:**
- RapidAPI: 50 requests/month (FREE)
- Free fallback: Unlimited (less reliable)
- OpenAI Whisper: $0.006/minute (~$0.03 per 5-min video)

**Total:** Essentially FREE for moderate use!
