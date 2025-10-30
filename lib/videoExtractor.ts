import axios from 'axios';
import { TwitterVideoData } from './types';

/**
 * Parse tweet ID from various Twitter/X URL formats
 */
export function parseTweetId(url: string): string {
  try {
    // Remove any query parameters
    const cleanUrl = url.split('?')[0];

    // Match pattern: twitter.com/*/status/1234567890 or x.com/*/status/1234567890
    const match = cleanUrl.match(/(?:twitter\.com|x\.com)\/.*\/status\/(\d+)/);

    if (match && match[1]) {
      return match[1];
    }

    throw new Error('Invalid Twitter/X URL format');
  } catch (error) {
    throw new Error('Could not parse tweet ID from URL');
  }
}

/**
 * Validate if URL is a valid Twitter/X URL
 */
export function isValidTwitterUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // Check if it's twitter.com or x.com
    const isValidDomain =
      hostname === 'twitter.com' ||
      hostname === 'x.com' ||
      hostname === 'www.twitter.com' ||
      hostname === 'www.x.com';

    // Check if it contains /status/
    const hasStatus = url.includes('/status/');

    return isValidDomain && hasStatus;
  } catch (error) {
    return false;
  }
}

/**
 * Extract video URL using RapidAPI Twitter Video Downloader
 * Tries multiple API endpoints as fallback
 */
async function extractVideoRapidAPI(tweetUrl: string): Promise<TwitterVideoData> {
  const apiKey = process.env.RAPIDAPI_KEY;

  if (!apiKey) {
    throw new Error('RAPIDAPI_KEY not configured. Please set it in .env.local');
  }

  // List of RapidAPI Twitter downloader endpoints to try
  const apiEndpoints = [
    // API 1: Twitter Video Downloader API
    {
      url: 'https://twitter-video-downloader-download-twitter-videos-gifs-and-images.p.rapidapi.com/status',
      host: 'twitter-video-downloader-download-twitter-videos-gifs-and-images.p.rapidapi.com',
      parseResponse: (data: any) => {
        if (!data || !data.media) throw new Error('No video found');
        const videos = data.media.video?.videoVariants || [];
        if (videos.length === 0) throw new Error('No video found');
        const mp4Videos = videos
          .filter((v: any) => v.content_type === 'video/mp4')
          .sort((a: any, b: any) => (b.bitrate || 0) - (a.bitrate || 0));
        if (mp4Videos.length === 0) throw new Error('No MP4 video format');
        return {
          videoUrl: mp4Videos[0].url,
          thumbnailUrl: data.media.video?.thumbnailUrl,
          duration: data.media.video?.durationMillis ? Math.floor(data.media.video.durationMillis / 1000) : undefined,
          title: data.text,
        };
      },
    },
    // API 2: Twitter Downloader API (alternative)
    {
      url: 'https://twitter-downloader-download-twitter-videos-gifs-and-images.p.rapidapi.com/status',
      host: 'twitter-downloader-download-twitter-videos-gifs-and-images.p.rapidapi.com',
      parseResponse: (data: any) => {
        if (!data || !data.media) throw new Error('No video found');
        const videos = data.media.video?.videoVariants || [];
        if (videos.length === 0) throw new Error('No video found');
        const mp4Videos = videos
          .filter((v: any) => v.content_type === 'video/mp4')
          .sort((a: any, b: any) => (b.bitrate || 0) - (a.bitrate || 0));
        if (mp4Videos.length === 0) throw new Error('No MP4 video format');
        return {
          videoUrl: mp4Videos[0].url,
          thumbnailUrl: data.media.video?.thumbnailUrl,
          duration: data.media.video?.durationMillis ? Math.floor(data.media.video.durationMillis / 1000) : undefined,
          title: data.text,
        };
      },
    },
    // API 3: Social Media Downloader
    {
      url: 'https://social-media-video-downloader.p.rapidapi.com/smvd/get/twitter',
      host: 'social-media-video-downloader.p.rapidapi.com',
      parseResponse: (data: any) => {
        if (!data || !data.links || data.links.length === 0) throw new Error('No video found');
        const videoLink = data.links.find((link: any) => link.quality === 'hd' || link.quality === 'sd');
        if (!videoLink) throw new Error('No video found');
        return {
          videoUrl: videoLink.link,
          title: data.title,
        };
      },
    },
  ];

  let lastError: any = null;

  // Try each API endpoint
  for (const endpoint of apiEndpoints) {
    try {
      console.log(`[VideoExtractor] Trying API: ${endpoint.host}`);

      const options = {
        method: 'GET',
        url: endpoint.url,
        params: { url: tweetUrl },
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': endpoint.host,
        },
        timeout: 10000, // 10 second timeout
      };

      const response = await axios.request(options);
      const videoData = endpoint.parseResponse(response.data);

      console.log(`[VideoExtractor] Success with API: ${endpoint.host}`);
      return videoData;

    } catch (error: any) {
      console.error(`[VideoExtractor] Failed with ${endpoint.host}:`, error.message);
      lastError = error;

      // If it's a 401 or 429, don't try other endpoints
      if (error.response?.status === 401) {
        throw new Error('Invalid RapidAPI key');
      }
      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later');
      }

      // Continue to next endpoint
      continue;
    }
  }

  // All endpoints failed
  if (lastError?.response?.status === 403) {
    throw new Error(
      'RapidAPI key not authorized. Please subscribe to a Twitter Video Downloader API at rapidapi.com/hub'
    );
  }

  throw new Error(lastError?.message || 'Failed to extract video from Twitter');
}

/**
 * Alternative: Extract video URL using free public API (no auth required)
 */
async function extractVideoFallback(tweetUrl: string): Promise<TwitterVideoData> {
  try {
    console.log('[VideoExtractor] Trying free public API...');

    // Extract tweet ID from URL
    const tweetId = parseTweetId(tweetUrl);

    // Try multiple free public APIs
    const freeAPIs = [
      // API 1: Twitter Video Downloader (no auth)
      {
        url: `https://twitsave.com/info?url=${encodeURIComponent(tweetUrl)}`,
        parseResponse: async (html: string) => {
          // Parse HTML to find video URL
          const match = html.match(/https:\/\/video\.twimg\.com\/[^"]+\.mp4/);
          if (!match) throw new Error('Could not find video URL');
          return { videoUrl: match[0] };
        },
      },
      // API 2: Try a different approach - download button link
      {
        url: `https://ssstwitter.com/${tweetUrl}`,
        parseResponse: async (html: string) => {
          const match = html.match(/https:\/\/[^"]*video[^"]*\.mp4/i);
          if (!match) throw new Error('Could not find video URL');
          return { videoUrl: match[0] };
        },
      },
    ];

    // Try each free API
    for (const api of freeAPIs) {
      try {
        const response = await axios.get(api.url, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          },
        });

        const videoData = await api.parseResponse(response.data);
        console.log('[VideoExtractor] Success with free API');
        return videoData;
      } catch (error) {
        console.error('[VideoExtractor] Free API failed:', error);
        continue;
      }
    }

    throw new Error(
      'All video extraction methods failed. Please subscribe to a Twitter Video Downloader API at rapidapi.com/hub (free tier available)'
    );
  } catch (error: any) {
    throw new Error(error.message || 'Fallback video extraction failed');
  }
}

/**
 * Main function to extract video from Twitter/X post
 */
export async function extractTwitterVideo(tweetUrl: string): Promise<string> {
  // Validate URL format
  if (!isValidTwitterUrl(tweetUrl)) {
    throw new Error('Invalid Twitter/X URL. Please provide a valid tweet URL with a video.');
  }

  try {
    // Try primary method (RapidAPI)
    const videoData = await extractVideoRapidAPI(tweetUrl);
    return videoData.videoUrl;
  } catch (error: any) {
    // If RapidAPI fails, try fallback method
    console.error('Primary extraction failed:', error.message);

    try {
      const videoData = await extractVideoFallback(tweetUrl);
      return videoData.videoUrl;
    } catch (fallbackError: any) {
      // Both methods failed
      throw new Error(
        `Failed to extract video: ${error.message}. ${fallbackError.message}`
      );
    }
  }
}

/**
 * Get video metadata without downloading
 */
export async function getVideoMetadata(tweetUrl: string): Promise<TwitterVideoData> {
  if (!isValidTwitterUrl(tweetUrl)) {
    throw new Error('Invalid Twitter/X URL');
  }

  return await extractVideoRapidAPI(tweetUrl);
}
