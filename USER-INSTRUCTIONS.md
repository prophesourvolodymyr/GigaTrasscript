# User Action Items - GigaTranscript

**Tasks That Require Human Action**

This file contains TODOs that AI agents cannot complete automatically. These tasks require you (the user) to perform manual actions like getting API keys, creating accounts, or configuring services.

---

## 🔴 High Priority - Required for Core Functionality

### ✅ COMPLETED: OpenAI API Key
**Status**: ✅ Done (User provides via UI)

**What It's For**: Transcription using Whisper API

**How It Works**: Users input their API key directly in the Settings modal - no setup needed.

---

### ⚠️ OPTIONAL: RapidAPI Twitter Video Downloader

**Status**: ⚠️ Optional (Free fallback available)

**What It's For**: Extracting video URLs from Twitter/X posts

**Current State**:
- Free fallback methods implemented
- Works without RapidAPI subscription
- RapidAPI provides better reliability

**Action Required (Optional)**:
1. Go to: https://rapidapi.com/PrestigeLimited/api/twitter-video-downloader-download-twitter-videos-gifs-and-images
2. Click "Subscribe to Test"
3. Select "Basic" plan (FREE - 50 requests/month)
4. Copy your API key from the code snippets section
5. Open `.env.local` file
6. Update: `RAPIDAPI_KEY=your_new_key_here`
7. Restart dev server: `npm run dev`

**Benefits of Subscribing**:
- More reliable video extraction
- Better error handling
- Supports more edge cases
- 50 free requests/month

**If You Don't Subscribe**:
- App will use free fallback methods
- Still works for most videos
- May fail on some edge cases

---

## 🟡 Medium Priority - For Additional Features

### 📋 Notion Integration (For Issue #11)

**Status**: 🔲 Not Started

**What It's For**: Export transcripts to Notion databases

**Action Required**:
1. Go to: https://www.notion.so/my-integrations
2. Click "+ New integration"
3. Name: "GigaTranscript"
4. Select your workspace
5. Click "Submit"
6. Copy the "Internal Integration Token"
7. Open `.env.local` file
8. Add: `NOTION_API_KEY=secret_xxxxx...`
9. Create a Notion database for transcripts
10. Share the database with your integration:
    - Open database in Notion
    - Click "..." → "Add connections"
    - Select "GigaTranscript"

**When Needed**: Before implementing Notion integration feature

**Blocks**: Issue #11 (Notion Integration)

---

## 🟢 Low Priority - For Future Features

### 🎥 Multi-Platform API Keys (For Issue #3)

**Status**: 🔲 Not Started

**What It's For**: Extract videos from TikTok, Instagram, YouTube, Vimeo

**Action Required**:

#### TikTok Support:
1. Subscribe to RapidAPI TikTok Downloader
2. URL: https://rapidapi.com/hub (search "TikTok Downloader")
3. Add to `.env.local`: `RAPIDAPI_TIKTOK_KEY=your_key`

#### Instagram Support:
1. Subscribe to RapidAPI Instagram Downloader
2. Add to `.env.local`: `RAPIDAPI_INSTAGRAM_KEY=your_key`

#### YouTube Support:
- Option A: Install yt-dlp on server (free, no API needed)
- Option B: Use YouTube Data API (requires Google Cloud account)

#### Vimeo Support:
1. Create Vimeo developer account: https://developer.vimeo.com
2. Create app and get access token
3. Add to `.env.local`: `VIMEO_ACCESS_TOKEN=your_token`

**When Needed**: Before implementing multi-platform support

**Blocks**: Issue #3 (Multi-Platform Video Support)

---

### 🐙 GitHub Token (Optional - For Better Rate Limits)

**Status**: ✅ Working without token (using anonymous API)

**What It's For**: GitHub Stars tracker with higher rate limits

**Current State**:
- Working with anonymous GitHub API (60 requests/hour)
- Sufficient for current usage

**Action Required (Optional)**:
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: "GigaTranscript Stars Tracker"
4. Scopes: Select `public_repo` only
5. Click "Generate token"
6. Copy the token
7. Open `.env.local` file
8. Add: `GITHUB_TOKEN=ghp_xxxxx...`
9. Restart dev server

**Benefits of Adding Token**:
- 5,000 requests/hour (vs 60 anonymous)
- No rate limit issues

**If You Don't Add Token**:
- App works fine
- Rate limited to 60 requests/hour
- Should be sufficient for normal usage

---

## 📝 Template for New User Actions

```markdown
### 🎯 [Feature Name]

**Status**: 🔲 Not Started / ⚠️ In Progress / ✅ Completed

**What It's For**: [Brief description]

**Action Required**:
1. Step 1
2. Step 2
3. Step 3

**Files to Update**: `.env.local`, `config.ts`, etc.

**When Needed**: [When this task becomes necessary]

**Blocks**: [Which features are blocked by this]

**Priority**: High / Medium / Low
```

---

## 🔧 Environment Variables Summary

Current `.env.local` setup:

```env
# Required for video extraction (optional - fallback available)
RAPIDAPI_KEY=7b72d509b0mshdf328bea30929f9p1a8e1bjsn4fb9d7cb1299

# Optional - For better GitHub API rate limits
# GITHUB_TOKEN=ghp_xxxxx...

# Future features (not yet needed):
# NOTION_API_KEY=secret_xxxxx...
# RAPIDAPI_TIKTOK_KEY=xxxxx
# RAPIDAPI_INSTAGRAM_KEY=xxxxx
# VIMEO_ACCESS_TOKEN=xxxxx

# Node environment
NODE_ENV=development
```

---

## ✅ Completed User Actions

### 1. ✅ Project Setup
- Installed Node.js and dependencies
- Created `.env.local` file
- Started dev server

### 2. ✅ RapidAPI Basic Setup
- Created RapidAPI account
- Got basic API key (even if not subscribed to specific API)

### 3. ✅ GitHub Repository
- Created repository: https://github.com/prophesourvolodymyr/GigaTrasscript
- Pushed code to GitHub

---

## 📊 Status Overview

| Task | Status | Priority | Blocks |
|------|--------|----------|--------|
| OpenAI API Key | ✅ Done | High | Core functionality |
| RapidAPI Subscription | ⚠️ Optional | Medium | Better reliability |
| Notion Integration | 🔲 Not Started | Low | Issue #11 |
| Multi-Platform APIs | 🔲 Not Started | Low | Issue #3 |
| GitHub Token | ⚠️ Optional | Low | Rate limits |

---

## 🔔 Notifications

**AI Agents**: When you encounter a task that requires user action:
1. Add it to this file using the template above
2. Update @PROGRESS.md if it blocks an issue
3. Notify the user clearly
4. Continue with other tasks if possible

---

*Last Updated: October 30, 2025*
*User action items for GigaTranscript*
