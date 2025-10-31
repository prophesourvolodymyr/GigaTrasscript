# 🤖 AI Agent Codebase Guide - Twitter Transcriber

> **Purpose:** This document serves as a quick reference for AI assistants to understand the Twitter Transcriber codebase structure, locate key files, and understand where to find setup instructions, progress tracking, and functionality documentation.

---

## 📋 Table of Contents

1. [Quick Overview](#quick-overview)
2. [Documentation Files Map](#documentation-files-map)
3. [User Manual Setup Tasks](#user-manual-setup-tasks)
4. [Progress & Roadmap Files](#progress--roadmap-files)
5. [Source Code Structure](#source-code-structure)
6. [Configuration Files](#configuration-files)
7. [Key Workflows](#key-workflows)
8. [Common Tasks Reference](#common-tasks-reference)

---

## 🎯 Quick Overview

**Project:** GigaTrasscript - Twitter Video Transcription Web App
**Tech Stack:** Next.js 14 (App Router), TypeScript, React 18, OpenAI Whisper API, RapidAPI
**Architecture:** Queue-based processing with glassmorphism UI and Three.js animated backgrounds

---

## 📚 Documentation Files Map

### Primary Documentation Locations

| File | Purpose | Lines | Location |
|------|---------|-------|----------|
| **`README.md`** | Project overview, quick start, features list | 50 | Root directory |
| **`QUICK_START.md`** | 5-minute setup guide, installation steps | 97 | Root directory |
| **`FUNCTIONALITY.md`** | Complete technical documentation, API specs | 652 | Root directory |
| **`PROGRESS.md`** | Development tracker, completed features, TODOs | 384 | Root directory |
| **`ROADMAP.md`** | Future feature ideas, long-term vision | 238 | Root directory |
| **`RAPIDAPI_SETUP.md`** | RapidAPI configuration, API endpoints | 114 | Root directory |
| **`USER TO DO.md`** | User manual setup tasks (currently empty) | 0 | Root directory |
| **`CODEBASE_GUIDE.md`** | This file - AI agent reference guide | - | Root directory |

### Quick File Purpose Summary

- **Need functionality details?** → Read [FUNCTIONALITY.md](FUNCTIONALITY.md)
- **Need setup instructions?** → Read [QUICK_START.md](QUICK_START.md)
- **Need current progress?** → Read [PROGRESS.md](PROGRESS.md)
- **Need future plans?** → Read [ROADMAP.md](ROADMAP.md)
- **Need RapidAPI help?** → Read [RAPIDAPI_SETUP.md](RAPIDAPI_SETUP.md)
- **Need user tasks?** → Read [USER TO DO.md](USER TO DO.md)

---

## 🔧 User Manual Setup Tasks

### Location: [USER TO DO.md](USER TO DO.md)

**Current Status:** Empty file (placeholder)

### Manual Setup Steps (Cannot be automated by AI)

These tasks require user action on external websites:

#### 1. **OpenAI API Key** (REQUIRED)
- **Where:** https://platform.openai.com/api-keys
- **Action:** User must create account → Generate API key → Copy key
- **Input Location:** App UI settings modal
- **Storage:** Browser localStorage (client-side only)
- **Cost:** $0.006 per minute of audio transcribed

#### 2. **RapidAPI Key** (REQUIRED for video extraction)
- **Where:** https://rapidapi.com/
- **Action:**
  1. Create RapidAPI account
  2. Subscribe to one of these APIs:
     - Twitter Downloader (Primary)
     - Twitter Media Downloader (Alternative)
     - Twitter V2 API (Alternative)
  3. Copy API key
- **Input Location:** `.env.local` file as `RAPIDAPI_KEY=your_key_here`
- **Fallback:** Free public APIs available (see [RAPIDAPI_SETUP.md](RAPIDAPI_SETUP.md))

#### 3. **GitHub Token** (OPTIONAL)
- **Where:** https://github.com/settings/tokens
- **Purpose:** Higher rate limits for GitHub API calls
- **Action:** Generate personal access token with `public_repo` scope
- **Input Location:** `.env.local` as `GITHUB_TOKEN=your_token`

#### 4. **Node.js Installation** (REQUIRED)
- **Where:** https://nodejs.org/
- **Version Required:** >= 18.0.0
- **Action:** Download and install Node.js

#### 5. **Environment File Setup** (REQUIRED)
- **File:** `.env.local` (must create manually)
- **Template:** `.env.local.example`
- **Action:** Copy example file and fill in API keys

```bash
# User must run this command:
cp .env.local.example .env.local
# Then edit .env.local with their API keys
```

---

## 📊 Progress & Roadmap Files

### [PROGRESS.md](PROGRESS.md) - Development Tracker

**Location:** Root directory
**Size:** 384 lines
**Last Updated:** Ongoing

**Sections:**
1. **What We've Built** - 10 completed core features
   - Core transcription functionality
   - Queue system with status tracking
   - Glassmorphism UI
   - GitHub stars integration
   - Error handling system

2. **Problems Overcome** - 6 major technical challenges
   - Socket hang-up error fix (critical)
   - Browser caching issues
   - RapidAPI 403 errors
   - Background scrolling problems
   - Color balance adjustments
   - Glass effect Safari compatibility

3. **Current TODOs** - 17 items (organized by priority)
   - **High Priority:** 10 items
     - Title import from Twitter
     - Smooth animations
     - Multi-platform support (YouTube, TikTok)
     - Download transcript button
   - **Medium Priority:** 7 items
     - Notion integration
     - Landing page
     - Analytics dashboard

**Progress Metrics:**
- Total Features: 17 planned
- Completed: 10 core features
- In Progress: 0
- TODO: 17 features
- Estimated Completion: 3-4 months

### [ROADMAP.md](ROADMAP.md) - Future Vision

**Location:** Root directory
**Size:** 238 lines

**Categories:**
- **Short-term:** Video format support, transcription features, UI polish
- **Medium-term:** Self-hosted service, CLI tool, queue management
- **Long-term:** Mobile app, team collaboration, API platform

**Technical Debt Items:**
- Code quality (tests, strict TypeScript, documentation)
- Performance (service worker, caching, optimization)
- Security (rate limiting, CSRF protection, input sanitization)

---

## 🗂️ Source Code Structure

### Application Core

```
Twitter Transcriber/
├── app/                                    # Next.js App Router
│   ├── page.tsx                           # Main application (639 lines)
│   ├── layout.tsx                         # Root layout with metadata
│   ├── globals.css                        # Global styles
│   ├── page-old.tsx                       # Backup of old version
│   └── api/                               # API routes
│       ├── transcribe/route.ts            # Main transcription endpoint (182 lines)
│       └── github/route.ts                # GitHub star counter API (41 lines)
│
├── components/ui/                         # Reusable UI components
│   ├── AnimatedCounter.tsx                # Star counter animation (71 lines)
│   ├── ColorBends.tsx                     # Three.js background (322 lines)
│   ├── GlassSurface.tsx                   # Glassmorphism effect (258 lines)
│   ├── ColorBends.css                     # ColorBends styles
│   ├── ColorBends.module.css              # Scoped ColorBends styles
│   ├── GlassSurface.css                   # GlassSurface styles
│   └── GlassSurface.module.css            # Scoped GlassSurface styles
│
├── lib/                                   # Utility libraries
│   ├── types.ts                           # TypeScript type definitions (62 lines)
│   ├── queueTypes.ts                      # Queue system types (21 lines)
│   ├── videoExtractor.ts                  # Twitter video extraction (286 lines)
│   ├── whisperClient.ts                   # OpenAI Whisper API client (156 lines)
│   ├── fileUtils.ts                       # File operations utilities (83 lines)
│   └── githubApi.ts                       # GitHub API integration (75 lines)
│
└── Configuration files (root)             # See Configuration Files section
```

### Key File Responsibilities

#### [app/page.tsx](app/page.tsx:1) - Main Application (639 lines)
**Purpose:** Main UI and application logic

**Key Features:**
- Queue-based transcription system
- API key management with localStorage
- Settings modal
- Transcript preview modal
- GitHub star counter
- Glassmorphism UI with animated background

**State Management:**
- `apiKey` - OpenAI API key (localStorage)
- `transcriptionQueue` - Array of transcription jobs
- `isSettingsOpen` - Settings modal state
- `showTranscript` - Transcript viewer state
- `githubStars` - GitHub star count

**Critical Functions:**
- `handleAddToQueue()` - Add Twitter URL to queue
- `processQueue()` - Process jobs sequentially
- `transcribeVideo()` - Call transcription API
- Effect hooks for localStorage sync and queue processing

#### [app/api/transcribe/route.ts](app/api/transcribe/route.ts:1) - Transcription API (182 lines)
**Purpose:** Main transcription endpoint

**Endpoints:**
- `POST /api/transcribe` - Transcribe Twitter video
- `GET /api/transcribe` - Health check

**Flow:**
1. Validate request (URL + API key)
2. Extract video from Twitter (multiple fallback methods)
3. Download video to temp file
4. Validate file size (25MB limit)
5. Transcribe with Whisper API
6. Cleanup temp files
7. Return transcript with metadata

**Error Handling:**
- 11 error codes (INVALID_URL, VIDEO_NOT_FOUND, FILE_TOO_LARGE, etc.)
- Automatic cleanup on failure
- 60-second max execution time

#### [lib/videoExtractor.ts](lib/videoExtractor.ts:1) - Video Extraction (286 lines)
**Purpose:** Extract Twitter video URLs with multiple fallback methods

**Key Functions:**
- `extractTwitterVideo()` - Main extraction function
- `extractVideoRapidAPI()` - Primary method (3 API endpoints)
- `extractVideoFallback()` - Free public APIs
- `parseTweetId()` - Extract tweet ID from URL
- `isValidTwitterUrl()` - URL validation
- `getVideoMetadata()` - Fetch video info

**Resilience:**
- 3 RapidAPI endpoints with automatic fallback
- Multiple free public APIs as backup
- Detailed error messages for troubleshooting

#### [lib/whisperClient.ts](lib/whisperClient.ts:1) - Whisper API Client (156 lines)
**Purpose:** OpenAI Whisper API integration

**Key Functions:**
- `transcribeAudio()` - Main transcription function
  - Reads file into buffer (prevents socket hang-up)
  - 2-minute timeout, 2 retries
  - Comprehensive error handling
- `validateApiKeyFormat()` - API key validation
- `estimateTranscriptionCost()` - Cost calculator
- `getSupportedLanguages()` - List of 98 languages

**Critical Fix:**
- Uses buffer instead of stream to avoid socket errors
- Validates file size before upload

#### [lib/fileUtils.ts](lib/fileUtils.ts:1) - File Utilities (83 lines)
**Purpose:** File operations and temp file management

**Functions:**
- `downloadFile()` - Stream video to temp file
- `cleanupFile()` - Delete temp files
- `getFileSize()` - Get file size in bytes
- `isFileSizeValid()` - Check file size limits
- `getTempFilePath()` - Generate unique temp paths

#### [lib/types.ts](lib/types.ts:1) - Type Definitions (62 lines)
**Purpose:** TypeScript interfaces and types

**Key Types:**
- `TranscribeRequest` / `TranscribeResponse`
- `ErrorCode` enum (11 error types)
- `VideoInfo` and `TwitterVideoData`
- `WhisperTranscriptionOptions`
- UI state types

#### [components/ui/ColorBends.tsx](components/ui/ColorBends.tsx:1) - Background Animation (322 lines)
**Purpose:** Three.js WebGL animated gradient background

**Features:**
- Shader-based rendering
- Up to 8 custom colors
- Mouse parallax effect
- Auto-rotation
- Configurable parameters (warp, frequency, noise, speed)

#### [components/ui/GlassSurface.tsx](components/ui/GlassSurface.tsx:1) - Glassmorphism (258 lines)
**Purpose:** VisionOS-inspired glass effect

**Features:**
- SVG filter-based chromatic aberration
- Dynamic displacement maps
- Customizable parameters (blur, opacity, RGB offsets)
- Safari/Firefox fallback
- ResizeObserver integration

---

## ⚙️ Configuration Files

### Build & Development

| File | Purpose | Key Settings |
|------|---------|--------------|
| **`package.json`** | Dependencies and scripts | Next.js 14.2, React 18, OpenAI SDK 4.28 |
| **`tsconfig.json`** | TypeScript config | Strict mode, ES2020, path aliases (`@/*`) |
| **`next.config.js`** | Next.js config | External packages: OpenAI SDK |
| **`tailwind.config.ts`** | Tailwind CSS | Custom fadeIn animation |
| **`postcss.config.js`** | PostCSS config | Tailwind + Autoprefixer |
| **`.eslintrc.json`** | ESLint config | Next.js core web vitals |
| **`.gitignore`** | Git ignore patterns | node_modules, .next, .env files |

### Environment Variables

**File:** `.env.local` (gitignored, must be created manually)
**Template:** `.env.local.example`

```env
RAPIDAPI_KEY=your_rapidapi_key_here
# TWITTER_BEARER_TOKEN=your_token (optional, not currently used)
NODE_ENV=development
```

**Note:** User OpenAI API keys are stored in browser localStorage, NOT in .env

---

## 🔄 Key Workflows

### 1. Transcription Workflow

```
User Input (Twitter URL)
    ↓
Add to Queue (pending status)
    ↓
Process Queue (one at a time)
    ↓
API Call: POST /api/transcribe
    ↓
Extract Video (RapidAPI → Fallback)
    ↓
Download to Temp File
    ↓
Validate File Size (< 25MB)
    ↓
Transcribe with Whisper API
    ↓
Cleanup Temp File
    ↓
Return Transcript
    ↓
Update Queue (completed/error status)
```

### 2. API Key Management

```
User Enters API Key in Settings
    ↓
Validate Format (starts with "sk-")
    ↓
Store in localStorage
    ↓
Sync with State
    ↓
Include in API Requests
```

### 3. Video Extraction Fallback

```
Try RapidAPI Endpoint 1 (Twitter Downloader)
    ↓ (if fails)
Try RapidAPI Endpoint 2 (Twitter Media Downloader)
    ↓ (if fails)
Try RapidAPI Endpoint 3 (Twitter V2 API)
    ↓ (if fails)
Try Free Public API 1 (twitsave.com)
    ↓ (if fails)
Try Free Public API 2 (ssstwitter.com)
    ↓ (if all fail)
Return VIDEO_NOT_FOUND error
```

---

## 📖 Common Tasks Reference

### For AI Agents Working on This Codebase

#### Task: Add New Feature
1. **Check:** [PROGRESS.md](PROGRESS.md) → Current TODOs section
2. **Check:** [ROADMAP.md](ROADMAP.md) → Find feature category
3. **Read:** [FUNCTIONALITY.md](FUNCTIONALITY.md) → Understand current implementation
4. **Update:** [PROGRESS.md](PROGRESS.md) → Move TODO to "In Progress"
5. **Implement:** Modify source files
6. **Update:** [PROGRESS.md](PROGRESS.md) → Move to "What We've Built"

#### Task: Fix Bug
1. **Check:** [PROGRESS.md](PROGRESS.md) → "Problems Overcome" section for similar issues
2. **Read:** [FUNCTIONALITY.md](FUNCTIONALITY.md) → Understand expected behavior
3. **Identify:** Relevant source file(s) from [Source Code Structure](#source-code-structure)
4. **Fix:** Implement solution
5. **Document:** Add to [PROGRESS.md](PROGRESS.md) → "Problems Overcome"

#### Task: Help User Set Up Project
1. **Direct to:** [QUICK_START.md](QUICK_START.md) for step-by-step instructions
2. **Direct to:** [USER TO DO.md](USER TO DO.md) for manual tasks
3. **Direct to:** [RAPIDAPI_SETUP.md](RAPIDAPI_SETUP.md) for RapidAPI help
4. **Verify:** `.env.local` exists and has correct keys
5. **Verify:** Node.js >= 18.0.0 installed
6. **Run:** `npm install` → `npm run dev`

#### Task: Understand How Feature Works
1. **Read:** [FUNCTIONALITY.md](FUNCTIONALITY.md) → Find feature documentation
2. **Locate:** Source file from [Source Code Structure](#source-code-structure)
3. **Check:** [lib/types.ts](lib/types.ts:1) for type definitions
4. **Trace:** API flow if backend feature

#### Task: Update Documentation
**When code changes:**
- Update [FUNCTIONALITY.md](FUNCTIONALITY.md) if API changes
- Update [PROGRESS.md](PROGRESS.md) if feature completed or issue fixed
- Update [ROADMAP.md](ROADMAP.md) if priorities change
- Update this file if file structure changes

#### Task: Check Project Status
- **Current progress:** [PROGRESS.md](PROGRESS.md) → "What We've Built"
- **Remaining work:** [PROGRESS.md](PROGRESS.md) → "Current TODOs"
- **Future plans:** [ROADMAP.md](ROADMAP.md)
- **Recent issues fixed:** [PROGRESS.md](PROGRESS.md) → "Problems Overcome"

---

## 🎯 Quick Answers to Common Questions

### "Where is the main application logic?"
[app/page.tsx](app/page.tsx:1) - 639 lines

### "Where is the transcription API endpoint?"
[app/api/transcribe/route.ts](app/api/transcribe/route.ts:1) - 182 lines

### "Where is the video extraction logic?"
[lib/videoExtractor.ts](lib/videoExtractor.ts:1) - 286 lines

### "Where is the Whisper API integration?"
[lib/whisperClient.ts](lib/whisperClient.ts:1) - 156 lines

### "Where are the type definitions?"
[lib/types.ts](lib/types.ts:1) and [lib/queueTypes.ts](lib/queueTypes.ts:1)

### "Where is the UI component code?"
[components/ui/](components/ui/) directory

### "Where are the current TODOs?"
[PROGRESS.md](PROGRESS.md) → "Current TODOs" section (17 items)

### "Where is the setup guide for users?"
[QUICK_START.md](QUICK_START.md) - 5-minute setup guide

### "Where is the complete functionality documentation?"
[FUNCTIONALITY.md](FUNCTIONALITY.md) - 652 lines of technical docs

### "What manual steps does the user need to do?"
See [User Manual Setup Tasks](#user-manual-setup-tasks) section above

### "Where are the environment variables configured?"
`.env.local` (must be created from `.env.local.example`)

### "How do I find what features are planned?"
[ROADMAP.md](ROADMAP.md) - organized by short/medium/long-term

---

## 📊 Project Statistics

- **Total Source Lines:** ~2,500 lines (excluding node_modules)
- **TypeScript Files:** 15+ files
- **Documentation Files:** 8 files
- **Dependencies:** 10 production, 8 development
- **Supported Languages:** 98 (Whisper API)
- **Max File Size:** 25MB per transcription
- **Cost:** $0.006 per minute of audio

---

## 🚀 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint

# Install dependencies
npm install
```

---

## 🔐 Security Notes

1. **API Keys:** User OpenAI keys stored in browser localStorage only (never sent to our server except in request headers)
2. **Server-side Validation:** All inputs validated on server
3. **File Size Limits:** Enforced to prevent abuse
4. **Temp Files:** Automatically cleaned up after processing
5. **Error Messages:** Don't expose sensitive information
6. **CORS:** Configured for frontend-only access

---

## 📝 Notes for AI Agents

1. **Always check [PROGRESS.md](PROGRESS.md) first** to understand current state
2. **Read [FUNCTIONALITY.md](FUNCTIONALITY.md)** before making changes to understand architecture
3. **Update documentation** when making code changes
4. **Follow existing code style** (TypeScript strict mode, functional components)
5. **Test thoroughly** before marking tasks as complete
6. **Consider fallback mechanisms** - this codebase emphasizes resilience
7. **User privacy is critical** - never suggest sending user API keys to server storage

---

**Last Updated:** 2025-10-30
**Maintained By:** AI Agents working on this codebase
**Primary Contact:** Repository owner

---

## 🔗 External Resources

- **OpenAI API Docs:** https://platform.openai.com/docs/api-reference/audio
- **RapidAPI Platform:** https://rapidapi.com/
- **Next.js 14 Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Three.js:** https://threejs.org/docs
