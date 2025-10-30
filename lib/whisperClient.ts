import OpenAI, { toFile } from 'openai';
import fs from 'fs';
import { WhisperTranscriptionOptions } from './types';

/**
 * Transcribe audio from a video file using OpenAI Whisper API
 */
export async function transcribeAudio(
  videoPath: string,
  apiKey: string,
  options: WhisperTranscriptionOptions = {}
): Promise<string> {
  // Validate API key
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error('OpenAI API key is required');
  }

  // Check if file exists
  if (!fs.existsSync(videoPath)) {
    throw new Error('Video file not found');
  }

  try {
    // Initialize OpenAI client with user's API key
    const openai = new OpenAI({
      apiKey: apiKey.trim(),
      timeout: 120000, // 2 minutes timeout
      maxRetries: 2,
    });

    // Get file stats
    const stats = fs.statSync(videoPath);
    console.log(`[WhisperClient] File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

    // Check file size (Whisper limit is 25MB)
    if (stats.size > 25 * 1024 * 1024) {
      throw new Error('Video file is too large. Maximum file size is 25MB.');
    }

    // Read file into buffer (critical for avoiding socket hang up)
    console.log('[WhisperClient] Reading file into buffer...');
    const fileBuffer = fs.readFileSync(videoPath);
    console.log(`[WhisperClient] File loaded into memory: ${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB`);

    // Default options
    const transcriptionOptions = {
      model: 'whisper-1',
      response_format: options.response_format || 'text',
      language: options.language, // Optional: 'en', 'es', etc. (auto-detect if not provided)
      prompt: options.prompt, // Optional: to guide the model's style
      temperature: options.temperature || 0, // 0-1, lower is more deterministic
    };

    console.log('[WhisperClient] Calling OpenAI Whisper API...');

    // Use toFile() with buffer (NOT stream!) to avoid socket issues
    const file = await toFile(fileBuffer, 'audio.mp4', { type: 'video/mp4' });

    // Call Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      ...transcriptionOptions,
    });

    console.log('[WhisperClient] Transcription received successfully');

    // Return transcript text
    if (typeof transcription === 'string') {
      return transcription;
    } else {
      return transcription.text || '';
    }
  } catch (error: any) {
    // Log full error for debugging
    console.error('[WhisperClient] Full error:', error);
    console.error('[WhisperClient] Error status:', error.status);
    console.error('[WhisperClient] Error code:', error.code);
    console.error('[WhisperClient] Error message:', error.message);

    // Handle specific OpenAI errors
    if (error.status === 401 || error.code === 'invalid_api_key') {
      throw new Error('Invalid OpenAI API key. Please check your key and try again.');
    }

    if (error.status === 429 || error.code === 'rate_limit_exceeded') {
      throw new Error('OpenAI rate limit exceeded. Please try again later or check your quota.');
    }

    if (error.status === 413) {
      throw new Error('Video file is too large. Maximum file size is 25MB.');
    }

    if (error.code === 'insufficient_quota') {
      throw new Error('OpenAI API quota exceeded. Please check your billing settings.');
    }

    // Handle network/connection errors
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      throw new Error('Network error: Cannot connect to OpenAI. Check your internet connection.');
    }

    // Generic error with more details
    const errorMsg = error.message || error.error?.message || 'Failed to transcribe audio';
    throw new Error(`${errorMsg}. Please try again.`);
  }
}

/**
 * Validate OpenAI API key format (basic check)
 */
export function validateApiKeyFormat(apiKey: string): boolean {
  // OpenAI keys start with 'sk-' and have specific length
  return apiKey.startsWith('sk-') && apiKey.length > 20;
}

/**
 * Estimate transcription cost based on duration
 * OpenAI Whisper pricing: $0.006 per minute
 */
export function estimateTranscriptionCost(durationSeconds: number): number {
  const minutes = Math.ceil(durationSeconds / 60);
  const costPerMinute = 0.006;
  return minutes * costPerMinute;
}

/**
 * Get supported languages for Whisper API
 */
export function getSupportedLanguages(): string[] {
  return [
    'en', // English
    'es', // Spanish
    'fr', // French
    'de', // German
    'it', // Italian
    'pt', // Portuguese
    'nl', // Dutch
    'pl', // Polish
    'ru', // Russian
    'ja', // Japanese
    'ko', // Korean
    'zh', // Chinese
    'ar', // Arabic
    'hi', // Hindi
    'tr', // Turkish
    'sv', // Swedish
    'da', // Danish
    'no', // Norwegian
    'fi', // Finnish
    'uk', // Ukrainian
    'vi', // Vietnamese
    'th', // Thai
    // ... and many more (98 languages total)
  ];
}
