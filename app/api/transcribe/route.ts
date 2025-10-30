import { NextRequest, NextResponse } from 'next/server';
import { extractTwitterVideo } from '@/lib/videoExtractor';
import { transcribeAudio, validateApiKeyFormat } from '@/lib/whisperClient';
import { downloadFile, cleanupFile, getTempFilePath, isFileSizeValid } from '@/lib/fileUtils';
import { TranscribeRequest, TranscribeResponse, ErrorCode } from '@/lib/types';

// Disable body size limit for this route (we're handling file downloads)
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds max execution time

/**
 * POST /api/transcribe
 * Main endpoint for transcribing Twitter videos
 */
export async function POST(request: NextRequest) {
  const tempFiles: string[] = [];
  const startTime = Date.now();

  try {
    // 1. Parse and validate request body
    const body: TranscribeRequest = await request.json();
    const { twitterUrl, openaiApiKey } = body;

    // Validate inputs
    if (!twitterUrl || typeof twitterUrl !== 'string') {
      return createErrorResponse('Twitter URL is required', 'INVALID_URL', 400);
    }

    if (!openaiApiKey || typeof openaiApiKey !== 'string') {
      return createErrorResponse('OpenAI API key is required', 'INVALID_API_KEY', 400);
    }

    // Validate API key format
    if (!validateApiKeyFormat(openaiApiKey)) {
      return createErrorResponse(
        'Invalid OpenAI API key format. Keys should start with "sk-"',
        'INVALID_API_KEY',
        400
      );
    }

    console.log(`[Transcribe] Starting transcription for URL: ${twitterUrl}`);

    // 2. Extract video URL from Twitter post
    let videoUrl: string;
    try {
      console.log('[Transcribe] Extracting video URL...');
      videoUrl = await extractTwitterVideo(twitterUrl);
      console.log('[Transcribe] Video URL extracted successfully');
    } catch (error: any) {
      console.error('[Transcribe] Video extraction failed:', error.message);

      // Determine error code
      let errorCode: ErrorCode = 'VIDEO_NOT_FOUND';
      if (error.message.includes('Invalid')) {
        errorCode = 'INVALID_URL';
      } else if (error.message.includes('private')) {
        errorCode = 'PRIVATE_VIDEO';
      } else if (error.message.includes('Rate limit')) {
        errorCode = 'RATE_LIMIT';
      }

      return createErrorResponse(error.message, errorCode, 400);
    }

    // 3. Download video to temporary file
    const tempVideoPath = getTempFilePath('mp4');
    tempFiles.push(tempVideoPath);

    try {
      console.log('[Transcribe] Downloading video...');
      await downloadFile(videoUrl, tempVideoPath);
      console.log('[Transcribe] Video downloaded successfully');
    } catch (error: any) {
      console.error('[Transcribe] Video download failed:', error.message);
      return createErrorResponse(
        'Failed to download video. Please try again.',
        'DOWNLOAD_FAILED',
        500
      );
    }

    // 4. Validate file size (Whisper API limit is 25MB)
    if (!isFileSizeValid(tempVideoPath, 25)) {
      await cleanupFile(tempVideoPath);
      return createErrorResponse(
        'Video file is too large (maximum 25MB). Please try a shorter video.',
        'VIDEO_TOO_LARGE',
        400
      );
    }

    // 5. Transcribe audio using Whisper API
    let transcript: string;
    try {
      console.log('[Transcribe] Starting transcription...');
      transcript = await transcribeAudio(tempVideoPath, openaiApiKey);
      console.log('[Transcribe] Transcription completed successfully');
    } catch (error: any) {
      console.error('[Transcribe] Transcription failed:', error.message);

      // Determine error code
      let errorCode: ErrorCode = 'API_ERROR';
      if (error.message.includes('Invalid') || error.message.includes('key')) {
        errorCode = 'INVALID_API_KEY';
      } else if (error.message.includes('rate limit') || error.message.includes('quota')) {
        errorCode = 'RATE_LIMIT';
      } else if (error.message.includes('too large')) {
        errorCode = 'VIDEO_TOO_LARGE';
      }

      return createErrorResponse(error.message, errorCode, 500);
    }

    // 6. Cleanup temporary files
    console.log('[Transcribe] Cleaning up temporary files...');
    await Promise.all(tempFiles.map((file) => cleanupFile(file)));

    // 7. Calculate processing time
    const processingTime = Date.now() - startTime;
    console.log(`[Transcribe] Total processing time: ${processingTime}ms`);

    // 8. Return success response
    const response: TranscribeResponse = {
      success: true,
      transcript,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    // Cleanup temporary files on error
    console.error('[Transcribe] Unexpected error:', error);
    await Promise.all(tempFiles.map((file) => cleanupFile(file)));

    return createErrorResponse(
      'An unexpected error occurred. Please try again.',
      'UNKNOWN_ERROR',
      500
    );
  }
}

/**
 * Helper function to create error responses
 */
function createErrorResponse(
  message: string,
  errorCode: ErrorCode,
  status: number
): NextResponse<TranscribeResponse> {
  const response: TranscribeResponse = {
    success: false,
    error: message,
    errorCode,
  };

  return NextResponse.json(response, { status });
}

/**
 * GET /api/transcribe
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      message: 'Twitter Transcript Generator API',
      version: '1.0.0',
    },
    { status: 200 }
  );
}
