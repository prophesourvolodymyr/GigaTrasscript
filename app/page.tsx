'use client';

import { useState, useEffect, useCallback } from 'react';
import { TranscribeResponse } from '@/lib/types';
import { TranscriptionJob, TranscriptionStatus } from '@/lib/queueTypes';
import {
  Copy,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
  X,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Star,
  Settings2,
} from 'lucide-react';
import GlassSurface, { type GlassSurfaceProps } from '@/components/ui/GlassSurface';
import ColorBends from '@/components/ui/ColorBends';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'giga-transcript-api-key';

const glassPreset: Partial<GlassSurfaceProps> = {
  borderRadius: 50,
  borderWidth: 0.07,
  backgroundOpacity: 0,
  saturation: 1,
  brightness: 50,
  opacity: 0.93,
  blur: 11,
  displace: 0.5,
  distortionScale: -180,
  redOffset: 0,
  greenOffset: 10,
  blueOffset: 20,
};

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [queue, setQueue] = useState<TranscriptionJob[]>([]);
  const [currentUrl, setCurrentUrl] = useState('');
  const [processing, setProcessing] = useState(false);
  const [viewingJob, setViewingJob] = useState<TranscriptionJob | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsKey, setSettingsKey] = useState('');
  const [settingsShowKey, setSettingsShowKey] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [starCount, setStarCount] = useState<number | null>(null);
  const [starHovered, setStarHovered] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setApiKey(stored);
    }
  }, []);

  // Fetch GitHub stars count
  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch('/api/github?owner=prophesourvolodymyr&repo=GigaTrasscript');
        const data = await response.json();
        if (data.success && data.data) {
          setStarCount(data.data.stars);
        }
      } catch (error) {
        console.error('Failed to fetch GitHub stars:', error);
      }
    };

    fetchStars();
    // Refresh every 5 minutes
    const interval = setInterval(fetchStars, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const trimmed = apiKey.trim();
    if (trimmed) {
      window.localStorage.setItem(STORAGE_KEY, trimmed);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [apiKey]);

  const addDisabled = !currentUrl.trim() || !apiKey.trim();

  const addToQueue = () => {
    if (addDisabled) {
      return;
    }

    const newJob: TranscriptionJob = {
      id: Date.now().toString(),
      twitterUrl: currentUrl.trim(),
      status: 'pending',
      addedAt: Date.now(),
    };

    setQueue(prev => [...prev, newJob]);
    setCurrentUrl('');
  };

  const openSettings = () => {
    setSettingsKey(apiKey);
    setSettingsShowKey(false);
    setSettingsSaved(false);
    setShowSettings(true);
  };

  const handleSaveSettings = () => {
    const trimmed = settingsKey.trim();
    setApiKey(trimmed);
    if (typeof window !== 'undefined') {
      if (trimmed) {
        window.localStorage.setItem(STORAGE_KEY, trimmed);
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 1800);
  };

  const handleClearSettings = () => {
    setSettingsKey('');
    setApiKey('');
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setSettingsSaved(false);
  };

  const processJob = useCallback(async (job: TranscriptionJob) => {
    setProcessing(true);

    setQueue(prev =>
      prev.map(j =>
        j.id === job.id
          ? { ...j, status: 'processing' as TranscriptionStatus, startedAt: Date.now() }
          : j
      )
    );

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          twitterUrl: job.twitterUrl,
          openaiApiKey: apiKey.trim(),
        }),
      });

      const data: TranscribeResponse = await response.json();

      if (data.success && data.transcript) {
        setQueue(prev =>
          prev.map(j =>
            j.id === job.id
              ? {
                  ...j,
                  status: 'completed' as TranscriptionStatus,
                  transcript: data.transcript,
                  videoTitle: data.videoTitle,
                  completedAt: Date.now(),
                }
              : j
          )
        );
      } else {
        setQueue(prev =>
          prev.map(j =>
            j.id === job.id
              ? {
                  ...j,
                  status: 'error' as TranscriptionStatus,
                  error: data.error || 'Failed to transcribe',
                  completedAt: Date.now(),
                }
              : j
          )
        );
      }
    } catch {
      setQueue(prev =>
        prev.map(j =>
          j.id === job.id
            ? {
                ...j,
                status: 'error' as TranscriptionStatus,
                error: 'Network error',
                completedAt: Date.now(),
              }
            : j
        )
      );
    } finally {
      setProcessing(false);
    }
  }, [apiKey]);

  useEffect(() => {
    if (processing || !apiKey) return;

    const pendingJob = queue.find(job => job.status === 'pending');
    if (!pendingJob) return;

    void processJob(pendingJob);
  }, [queue, processing, apiKey, processJob]);

  const removeJob = (jobId: string) => {
    setQueue(prev => prev.filter(j => j.id !== jobId));
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Failed to copy to clipboard');
    }
  };

  const getStatusIcon = (status: TranscriptionStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-slate-200/70" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin text-sky-300" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-emerald-300" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-rose-400" />;
    }
  };

  const getStatusText = (job: TranscriptionJob) => {
    switch (job.status) {
      case 'pending':
        return 'Waiting in queue…';
      case 'processing':
        return 'Transcribing now…';
      case 'completed':
        return 'Ready to view';
      case 'error':
        return `Error: ${job.error}`;
    }
  };

  const formatUrl = (url: string, title?: string) => {
    if (title) {
      // Truncate title if too long
      return title.length > 60 ? title.slice(0, 60) + '...' : title;
    }
    const match = url.match(/status\/(\d+)/);
    return match ? `Tweet ${match[1].slice(-6)}` : 'Tweet';
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden text-slate-100">
      <div className="fixed inset-0 -z-10 h-screen w-screen">
        <ColorBends
          className="absolute inset-0 h-full w-full"
        rotation={0}
        autoRotate={0}
        speed={0.2}
        scale={1}
        frequency={1}
        warpStrength={1}
        mouseInfluence={1}
        parallax={0.5}
        noise={0}
        colors={[
          '#3a1050',
          '#501038',
          '#105038',
          '#103850',
          '#503810',
          '#385010',
          '#103838',
          '#381038',
        ]}
        transparent={false}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-8 lg:px-12">
        <GlassSurface
          {...glassPreset}
          width="100%"
          height="auto"
          className="w-full"
        >
          <div className="flex w-full items-center justify-between gap-6 px-8 py-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold tracking-wider text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                GIGA TRANSCRIPT
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={openSettings}
                className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                <Settings2 className="h-4 w-4" />
                Settings
              </button>
              <a
                href="https://github.com/prophesourvolodymyr/GigaTrasscript"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setStarHovered(true)}
                onMouseLeave={() => setStarHovered(false)}
                className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-yellow-400/40 hover:bg-white/10 hover:text-white"
              >
                <div className="relative">
                  <Star
                    className={`h-4 w-4 transition-all duration-300 ${
                      starHovered ? 'fill-yellow-400 text-yellow-400 scale-110' : 'text-slate-200'
                    }`}
                  />
                  {starHovered && (
                    <>
                      <span className="absolute inset-0 animate-ping">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 opacity-75" />
                      </span>
                    </>
                  )}
                </div>
                <span className="relative z-10">
                  {starCount !== null ? (
                    <span className="flex items-center gap-1.5">
                      <span className={starHovered ? 'text-yellow-400' : ''}>Star</span>
                      <AnimatedCounter
                        value={starCount}
                        duration={2000}
                        className={`font-semibold tabular-nums ${starHovered ? 'text-yellow-400' : 'text-slate-100'}`}
                        formatValue={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toString()}
                      />
                    </span>
                  ) : (
                    'Star on GitHub'
                  )}
                </span>
              </a>
            </div>
          </div>
        </GlassSurface>

        <div className="flex flex-1 items-center justify-center">
          <div className="flex w-full max-w-2xl flex-col items-center gap-10 text-center">
            <div className="flex flex-col gap-4">
              <h1 className="text-5xl font-bold text-white lg:text-6xl">
                Twitter Transcript Generator
              </h1>
              <p className="text-lg text-slate-200/80">
                Extract and transcribe audio from Twitter/X video posts
              </p>
            </div>

            <div className="flex w-full flex-col gap-4">
              <GlassSurface
                {...glassPreset}
                width="100%"
                height="auto"
                className="w-full"
              >
                <div className="flex w-full items-center gap-3 px-6 py-4">
                  <input
                    id="api-key"
                    type={showApiKey ? 'text' : 'password'}
                    placeholder="OpenAI API key"
                    value={apiKey}
                    onChange={event => setApiKey(event.target.value)}
                    className="flex-1 bg-transparent text-base text-slate-100 placeholder:text-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(prev => !prev)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-200 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </GlassSurface>

              <GlassSurface
                {...glassPreset}
                width="100%"
                height="auto"
                className="w-full"
              >
                <div className="flex w-full items-center gap-3 px-6 py-4">
                  <input
                    id="twitter-url"
                    type="text"
                    placeholder="Paste the X video link"
                    value={currentUrl}
                    onChange={event => setCurrentUrl(event.target.value)}
                    onKeyDown={event => event.key === 'Enter' && addToQueue()}
                    className="flex-1 bg-transparent text-base text-slate-100 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </GlassSurface>

              <button
                onClick={addToQueue}
                disabled={addDisabled}
                className={`inline-flex items-center justify-center gap-3 rounded-full border px-8 py-3 text-base font-semibold transition ${
                  addDisabled
                    ? 'cursor-not-allowed border-white/10 text-slate-500'
                    : 'border-white/20 text-white hover:border-white/35 hover:bg-white/10'
                }`}
              >
                <Plus className="h-4 w-4" />
                <span>Queue Video</span>
              </button>
            </div>

            {queue.length > 0 && (
              <div className="w-full">
                <GlassSurface
                  {...glassPreset}
                  width="100%"
                  height="auto"
                  className="w-full"
                >
                  <div className="flex w-full flex-col gap-6 px-6 py-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-white">
                        Queue ({queue.length})
                      </h2>
                      <div className="text-sm text-slate-300">
                        {queue.filter(j => j.status === 'completed').length} completed
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      {queue.map(job => (
                        <GlassSurface
                          {...glassPreset}
                          key={job.id}
                          width="100%"
                          height="auto"
                          className="w-full"
                        >
                          <div className="flex w-full items-center justify-between gap-4 px-5 py-4">
                            <div className="flex items-center gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10">
                                {getStatusIcon(job.status)}
                              </div>
                              <div className="text-left">
                                <div className="font-medium text-white">{formatUrl(job.twitterUrl, job.videoTitle)}</div>
                                <div className="text-sm text-slate-300">{getStatusText(job)}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {job.status === 'completed' && (
                                <button
                                  onClick={() => setViewingJob(job)}
                                  className="rounded-full border border-emerald-400/40 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-400/10"
                                >
                                  View
                                </button>
                              )}
                              {(job.status === 'pending' || job.status === 'error') && (
                                <button
                                  onClick={() => removeJob(job.id)}
                                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-slate-300 transition hover:bg-rose-400/15 hover:text-white"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </GlassSurface>
                      ))}
                    </div>
                  </div>
                </GlassSurface>
              </div>
            )}
        </div>
      </div>
    </div>

    <AnimatePresence>
      {showSettings && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg p-4"
          onClick={() => setShowSettings(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <GlassSurface
              {...glassPreset}
              width="100%"
              height="auto"
              className="max-h-[90vh] w-full max-w-xl"
            >
          <div className="flex h-full w-full flex-col gap-6 px-8 py-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-white">Settings</h3>
                <p className="text-sm text-slate-300">
                  Save your OpenAI API key securely in this browser.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-slate-200 transition hover:border-white/35 hover:bg-white/15 hover:text-white"
                aria-label="Close settings"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-200/80">
                OpenAI API Key
              </label>
              <div className="relative flex items-center">
                <input
                  type={settingsShowKey ? 'text' : 'password'}
                  value={settingsKey}
                  onChange={event => setSettingsKey(event.target.value)}
                  placeholder="sk-..."
                  className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-base text-slate-100 placeholder:text-slate-400 backdrop-blur-md transition focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
                />
                <button
                  type="button"
                  onClick={() => setSettingsShowKey(prev => !prev)}
                  className="absolute right-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-200 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                  aria-label="Toggle API key visibility"
                >
                  {settingsShowKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Stored only in localStorage on this device. Clear it any time to remove access.
              </p>
            </div>

            {settingsSaved && (
              <div className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>API key saved locally</span>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClearSettings}
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                Clear Key
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                className="rounded-full border border-sky-400/50 px-4 py-2 text-sm font-medium text-sky-200 transition hover:border-sky-300/60 hover:bg-sky-400/15 hover:text-white"
              >
                Save Key
              </button>
            </div>
          </div>
        </GlassSurface>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    <AnimatePresence>
      {viewingJob && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-lg p-4"
          onClick={() => setViewingJob(null)}
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl"
          >
            <GlassSurface
              {...glassPreset}
              width="100%"
              height="auto"
              className="max-h-[80vh] w-full"
            >
            <div className="flex h-full w-full flex-col gap-6 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-white">Transcript</h3>
                  <p className="text-sm text-slate-300">
                    {viewingJob.videoTitle || formatUrl(viewingJob.twitterUrl)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleCopy(viewingJob.transcript || '')}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                      copied
                        ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
                        : 'border-sky-400/40 text-sky-200 hover:bg-sky-400/15'
                    }`}
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setViewingJob(null)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-slate-200 transition hover:bg-white/15"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="relative flex-1 overflow-hidden">
                <div className="absolute inset-0 overflow-y-auto rounded-2xl border border-white/10 bg-white/5 p-6 text-left text-sm text-slate-100">
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {viewingJob.transcript}
                  </p>
                </div>
              </div>
            </div>
          </GlassSurface>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </main>
  );
}
