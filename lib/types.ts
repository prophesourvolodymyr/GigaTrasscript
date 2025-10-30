// API Request/Response Types

export interface TranscribeRequest {
  twitterUrl: string;
  openaiApiKey: string;
}

export interface TranscribeResponse {
  success: boolean;
  transcript?: string;
  duration?: number;
  error?: string;
  errorCode?: ErrorCode;
}

export type ErrorCode =
  | 'INVALID_URL'
  | 'VIDEO_NOT_FOUND'
  | 'PRIVATE_VIDEO'
  | 'VIDEO_TOO_LARGE'
  | 'DOWNLOAD_FAILED'
  | 'INVALID_API_KEY'
  | 'API_ERROR'
  | 'RATE_LIMIT'
  | 'UNSUPPORTED_FORMAT'
  | 'UNKNOWN_ERROR';

// Video Extraction Types

export interface VideoInfo {
  url: string;
  duration?: number;
  fileSize?: number;
  format?: string;
}

export interface TwitterVideoData {
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  title?: string;
}

// Whisper API Types

export interface WhisperTranscriptionOptions {
  language?: string;
  prompt?: string;
  temperature?: number;
  response_format?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';
}

// UI State Types

export interface TranscriptionState {
  loading: boolean;
  transcript: string;
  error: string;
  progress: number;
}
