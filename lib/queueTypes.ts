// Queue System Types

export type TranscriptionStatus = 'pending' | 'processing' | 'completed' | 'error';

export interface TranscriptionJob {
  id: string;
  twitterUrl: string;
  status: TranscriptionStatus;
  transcript?: string;
  error?: string;
  addedAt: number;
  startedAt?: number;
  completedAt?: number;
  videoTitle?: string;
}

export interface QueueState {
  jobs: TranscriptionJob[];
  activeJobId: string | null;
}
