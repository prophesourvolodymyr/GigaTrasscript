import fs from 'fs';
import path from 'path';
import axios from 'axios';

/**
 * Download a file from a URL to a local path
 */
export async function downloadFile(url: string, outputPath: string): Promise<void> {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
      timeout: 60000, // 60 seconds timeout
    });

    // Ensure the directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const writer = fs.createWriteStream(outputPath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error: any) {
    throw new Error(`Failed to download file: ${error.message}`);
  }
}

/**
 * Delete a file if it exists
 */
export async function cleanupFile(filePath: string): Promise<void> {
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  } catch (error) {
    // Silent fail - cleanup is best effort
    console.error(`Failed to cleanup file ${filePath}:`, error);
  }
}

/**
 * Get file size in bytes
 */
export function getFileSize(filePath: string): number {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

/**
 * Check if file size exceeds limit (25MB for Whisper API)
 */
export function isFileSizeValid(filePath: string, maxSizeMB: number = 25): boolean {
  const fileSizeBytes = getFileSize(filePath);
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return fileSizeBytes <= maxSizeBytes;
}

/**
 * Generate a unique temporary file path
 */
export function getTempFilePath(extension: string = 'mp4'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const filename = `twitter-video-${timestamp}-${random}.${extension}`;

  // Use /tmp for Unix-like systems, or a temp directory for Windows
  const tmpDir = process.env.TMPDIR || process.env.TEMP || '/tmp';
  return path.join(tmpDir, filename);
}
