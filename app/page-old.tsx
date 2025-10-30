'use client';

import { useState } from 'react';
import { TranscribeResponse } from '@/lib/types';
import { Copy, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

export default function Home() {
  const [twitterUrl, setTwitterUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleTranscribe = async () => {
    // Reset states
    setLoading(true);
    setError('');
    setTranscript('');
    setCopied(false);

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          twitterUrl: twitterUrl.trim(),
          openaiApiKey: apiKey.trim(),
        }),
      });

      const data: TranscribeResponse = await response.json();

      if (data.success && data.transcript) {
        setTranscript(data.transcript);
      } else {
        setError(data.error || 'Failed to transcribe video. Please try again.');
      }
    } catch (err: any) {
      setError('Network error. Please check your connection and try again.');
      console.error('Transcription error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      setCopied(true);

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard');
    }
  };

  const isFormValid = twitterUrl.trim().length > 0 && apiKey.trim().length > 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Twitter Transcript Generator
          </h1>
          <p className="text-lg text-gray-600">
            Extract and transcribe audio from Twitter/X video posts
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {/* Twitter URL Input */}
          <div className="mb-6">
            <label
              htmlFor="twitter-url"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Twitter/X Video Post URL
            </label>
            <input
              id="twitter-url"
              type="text"
              placeholder="https://x.com/username/status/1234567890..."
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* API Key Input */}
          <div className="mb-6">
            <label
              htmlFor="api-key"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              OpenAI API Key
            </label>
            <div className="relative">
              <input
                id="api-key"
                type={showApiKey ? 'text' : 'password'}
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                disabled={loading}
              >
                {showApiKey ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Your API key is only used for this request and is never stored.{' '}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Get your API key
              </a>
            </p>
          </div>

          {/* Transcribe Button */}
          <button
            onClick={handleTranscribe}
            disabled={!isFormValid || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Transcribing...</span>
              </>
            ) : (
              <span>Transcribe Video</span>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Transcript Display */}
        {transcript && (
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Transcript</h2>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  copied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {transcript}
              </p>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Powered by OpenAI Whisper API • Cost: ~$0.006 per minute
          </p>
        </div>
      </div>
    </main>
  );
}
