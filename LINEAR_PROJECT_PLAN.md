# GigaTranscript - Linear Project Plan

**Project**: GigaTranscript
**Team**: Personal
**Repository**: https://github.com/prophesourvolodymyr/GigaTrasscript
**Status**: Active Development

---

## 🎯 Project Overview

Open-source Twitter/X video transcription tool with queue system, glassmorphism UI, and OpenAI Whisper integration.

**Completed Features**:
- ✅ Core transcription pipeline (Twitter → Video → Whisper → Text)
- ✅ Queue management system
- ✅ Glassmorphism UI with ColorBends background
- ✅ GitHub Stars tracker with animated counter
- ✅ Video title extraction from Twitter API
- ✅ Settings modal for API key management
- ✅ Transcript preview and copy functionality

---

## 📋 HIGH PRIORITY ISSUES

### Issue #1: Modal Animations
**Priority**: High
**Complexity**: Low
**Time Estimate**: 2-3 hours

**Description**:
Add smooth animations to modals for better UX. Settings modal and transcript preview need professional enter/exit animations.

**Task Breakdown**:
- [ ] Install and configure Framer Motion library
- [ ] Add fade-in + scale animation to Settings modal (duration: 300ms, ease-out)
- [ ] Add slide-up animation to transcript preview modal (from bottom, duration: 400ms)
- [ ] Add smooth fade-out on modal close
- [ ] Test animations on mobile devices
- [ ] Ensure animations don't interfere with modal functionality

**Files**:
- `app/page.tsx` (Settings modal: lines 441-521)
- `app/page.tsx` (Transcript modal: lines 523-578)
- `package.json` (add framer-motion dependency)

**Acceptance Criteria**:
- [ ] Settings modal fades in with scale effect
- [ ] Transcript modal slides up from bottom
- [ ] Animations are smooth (60fps)
- [ ] No layout shift during animations
- [ ] Works on mobile and desktop

---

### Issue #2: Multi-Platform Video Support
**Priority**: High
**Complexity**: High
**Time Estimate**: 1-2 weeks

**Description**:
Extend video extraction to support TikTok, Instagram, YouTube, and Vimeo in addition to Twitter/X.

**Task Breakdown**:
- [ ] Research video extraction APIs for each platform
  - TikTok: RapidAPI TikTok Downloader
  - Instagram: RapidAPI Instagram Downloader
  - YouTube: youtube-dl or yt-dlp
  - Vimeo: Vimeo oEmbed API
- [ ] Create platform detection function from URL
- [ ] Implement TikTok video extractor
- [ ] Implement Instagram video extractor
- [ ] Implement YouTube video extractor
- [ ] Implement Vimeo video extractor
- [ ] Update `VideoExtractor` interface to support multiple platforms
- [ ] Add platform-specific error handling
- [ ] Update URL validation to accept all platform formats
- [ ] Add platform icons to queue items
- [ ] Test with real URLs from each platform

**Files**:
- `lib/videoExtractor.ts` (add extractors)
- `lib/types.ts` (update VideoInfo type)
- `app/page.tsx` (update URL validation)
- `public/icons/` (platform logos)

**Acceptance Criteria**:
- [ ] Successfully extracts videos from all 5 platforms
- [ ] Platform auto-detected from URL
- [ ] Appropriate error messages for each platform
- [ ] Platform icon shown in queue
- [ ] Works with public and unlisted videos

---

### Issue #3: Settings UI Enhancement
**Priority**: High
**Complexity**: Low
**Time Estimate**: 2-3 hours

**Description**:
Improve Settings modal styling to match the glassmorphism design language used throughout the app.

**Task Breakdown**:
- [ ] Add darker background overlay with backdrop-blur
- [ ] Ensure GlassSurface settings match main UI
- [ ] Update input field styling for consistency
- [ ] Add smooth focus states to input fields
- [ ] Improve button hover effects
- [ ] Add subtle animations to save/clear actions
- [ ] Test on different screen sizes
- [ ] Ensure accessibility (keyboard navigation, ARIA labels)

**Files**:
- `app/page.tsx:441-521` (Settings modal)

**Acceptance Criteria**:
- [ ] Settings modal matches app's glass aesthetic
- [ ] Background overlay is darker with blur
- [ ] All interactive elements have hover states
- [ ] Keyboard navigation works perfectly
- [ ] No visual inconsistencies

---

### Issue #4: Title Animation
**Priority**: Medium
**Complexity**: Low
**Time Estimate**: 1-2 hours

**Description**:
Add eye-catching animation to main title "Twitter Transcript Generator" for better first impression.

**Task Breakdown**:
- [ ] Choose animation style (fade-in, slide-up, or typing effect)
- [ ] Implement animation using Framer Motion or CSS
- [ ] Set timing: delay 200ms, duration 800ms
- [ ] Add stagger effect to subtitle
- [ ] Ensure animation only plays once on page load
- [ ] Test performance on slower devices
- [ ] Make animation subtle and professional

**Files**:
- `app/page.tsx:306-312` (main title section)

**Acceptance Criteria**:
- [ ] Title animates smoothly on page load
- [ ] Animation is professional and not distracting
- [ ] No layout shift during animation
- [ ] Works on mobile devices
- [ ] No performance issues

---

### Issue #5: API Key Management Improvements
**Priority**: High
**Complexity**: Medium
**Time Estimate**: 3-4 hours

**Description**:
Improve API key management flow for better security and UX. Remove main page API key input, force users to use Settings modal.

**Task Breakdown**:
- [ ] Remove API key input from main page
- [ ] Update UI to show "Configure API Key" button if not set
- [ ] Add toast notification when API key saved (use react-hot-toast)
- [ ] Implement API key format validation (sk-...)
- [ ] Add "Test API Key" button in Settings
- [ ] Show last 4 characters of saved key
- [ ] Add visual indicator in header when key is set
- [ ] Handle API key errors gracefully
- [ ] Update localStorage key management

**Files**:
- `app/page.tsx:322-338` (remove API key input)
- `app/page.tsx:441-521` (Settings modal)
- `package.json` (add react-hot-toast)

**Acceptance Criteria**:
- [ ] No API key input on main page
- [ ] Settings modal is only way to set key
- [ ] Toast notifications work
- [ ] API key validation prevents invalid keys
- [ ] User knows if key is configured
- [ ] Test key button verifies with OpenAI

---

### Issue #6: Upload Video System
**Priority**: High
**Complexity**: High
**Time Estimate**: 1 week

**Description**:
Add file upload functionality to transcribe local video files without needing a URL.

**Task Breakdown**:
- [ ] Create VideoUpload component with drag-and-drop
- [ ] Add file type validation (MP4, MOV, AVI, WebM)
- [ ] Implement file size validation (25MB max)
- [ ] Create upload progress indicator
- [ ] Store uploaded file in temp directory
- [ ] Update transcribe API to accept file uploads
- [ ] Add multipart/form-data handling
- [ ] Clean up temp files after transcription
- [ ] Add file preview (thumbnail + metadata)
- [ ] Update UI to toggle between URL and upload modes
- [ ] Test with various file formats and sizes

**Files**:
- New: `components/VideoUpload.tsx`
- Update: `app/api/transcribe/route.ts`
- Update: `app/page.tsx`
- New: `lib/fileUpload.ts`

**Acceptance Criteria**:
- [ ] Drag and drop works smoothly
- [ ] File validation prevents invalid uploads
- [ ] Progress indicator shows upload status
- [ ] Transcription works with uploaded files
- [ ] Temp files cleaned up properly
- [ ] Works on mobile devices

---

### Issue #7: Social Media Logo Integration
**Priority**: Medium
**Complexity**: Low
**Time Estimate**: 2-3 hours

**Description**:
Add platform logos next to video titles in queue for better visual recognition.

**Task Breakdown**:
- [ ] Download/create platform icons (Twitter, TikTok, Instagram, YouTube, Vimeo)
- [ ] Add icons to `public/icons/` folder
- [ ] Create helper function to detect platform from URL
- [ ] Update queue item component to show platform icon
- [ ] Add icon with glassmorphism background
- [ ] Ensure icons are accessible (alt text)
- [ ] Make icons responsive
- [ ] Add subtle hover effect to icons

**Files**:
- `public/icons/` (new folder)
- `app/page.tsx:393-431` (queue items)
- `lib/platformDetector.ts` (new file)

**Acceptance Criteria**:
- [ ] Correct icon shown for each platform
- [ ] Icons match app's design aesthetic
- [ ] Icons are crisp on retina displays
- [ ] Accessible with proper alt text
- [ ] Works on all screen sizes

---

### Issue #8: Fix Transcript Preview Display Bug
**Priority**: High (Bug Fix)
**Complexity**: Low
**Time Estimate**: 1 hour

**Description**:
Transcript text is not rendering in preview modal. Only copy button works. Need to debug and fix text display.

**Task Breakdown**:
- [ ] Inspect transcript modal code (app/page.tsx:568-574)
- [ ] Verify transcript data is available in viewingJob state
- [ ] Check CSS styling that might hide text
- [ ] Ensure whitespace-pre-wrap is applied
- [ ] Test with long transcripts (scroll behavior)
- [ ] Add loading state if transcript is delayed
- [ ] Verify text is selectable for copying

**Files**:
- `app/page.tsx:523-578` (viewingJob modal)

**Acceptance Criteria**:
- [ ] Transcript text renders correctly
- [ ] Text is readable with proper styling
- [ ] Long transcripts scroll properly
- [ ] Text can be selected manually
- [ ] Copy button still works

---

## 📊 MEDIUM PRIORITY ISSUES

### Issue #9: Notion Integration
**Priority**: Medium
**Complexity**: Very High
**Time Estimate**: 1-2 weeks

**Description**:
Enable users to export transcripts directly to their Notion workspace via OAuth.

**Task Breakdown**:
- [ ] Research Notion API and OAuth 2.0 flow
- [ ] Create Notion integration in Notion Developer Portal
- [ ] Implement OAuth callback route
- [ ] Create Notion API client library
- [ ] Store OAuth tokens securely (encrypted localStorage)
- [ ] Add "Connect Notion" button in Settings
- [ ] Show connection status in Settings
- [ ] Add "Export to Notion" button in transcript modal
- [ ] Implement page creation with transcript content
- [ ] Add database selector (let user choose destination)
- [ ] Handle token refresh automatically
- [ ] Add error handling for API failures
- [ ] Show success/error notifications
- [ ] Add "Disconnect Notion" functionality

**Files**:
- New: `lib/notionClient.ts`
- New: `app/api/notion/auth/route.ts`
- New: `app/api/notion/callback/route.ts`
- New: `app/api/notion/export/route.ts`
- Update: `app/page.tsx`

**Acceptance Criteria**:
- [ ] OAuth flow works smoothly
- [ ] User can connect Notion workspace
- [ ] Transcripts export to Notion successfully
- [ ] User can choose destination database
- [ ] Tokens stored securely
- [ ] Automatic token refresh works

---

### Issue #10: Sync Text Copy Window UI
**Priority**: Medium
**Complexity**: Low
**Time Estimate**: 2 hours

**Description**:
Update transcript preview modal styling to perfectly match glassmorphism design of Settings modal.

**Task Breakdown**:
- [ ] Match GlassSurface settings to Settings modal
- [ ] Add consistent backdrop blur overlay
- [ ] Update button styling (Copy, Close)
- [ ] Ensure text container has glass effect
- [ ] Add smooth scroll for long transcripts
- [ ] Match padding and spacing to Settings
- [ ] Test on different screen sizes

**Files**:
- `app/page.tsx:523-578` (transcript modal)

**Acceptance Criteria**:
- [ ] Styling matches Settings modal exactly
- [ ] Glass effects consistent throughout
- [ ] Text is readable on glass background
- [ ] Scroll behavior is smooth

---

### Issue #11: Landing Page Explanation Section
**Priority**: Medium
**Complexity**: High
**Time Estimate**: 1 week

**Description**:
Create animated scrolling section below main app that explains features with GSAP ScrollTrigger.

**Task Breakdown**:
- [ ] Install and configure GSAP with ScrollTrigger
- [ ] Design 3-section layout (text left, image right)
- [ ] Create ExplanationSection component
- [ ] Take screenshots of app features for images
- [ ] Implement scroll-triggered fade-in animations for text
- [ ] Add tilt effect to images on scroll
- [ ] Images slide from left to right on scroll
- [ ] Add parallax effect for depth
- [ ] Titles animate from different angles
- [ ] Make fully responsive for mobile
- [ ] Test scroll performance
- [ ] Add loading states for images

**Files**:
- New: `components/ExplanationSection.tsx`
- Update: `app/page.tsx`
- New: `public/screenshots/` (feature images)
- Update: `package.json` (add GSAP)

**Acceptance Criteria**:
- [ ] 3 distinct feature sections with animations
- [ ] Text fades in smoothly on scroll
- [ ] Images have tilt rotation effect
- [ ] Parallax creates depth perception
- [ ] Smooth 60fps animations
- [ ] Works on mobile devices

---

### Issue #12: Create Header Component
**Priority**: Medium
**Complexity**: Low
**Time Estimate**: 2-3 hours

**Description**:
Extract header into reusable component for better code organization. Make sticky on scroll.

**Task Breakdown**:
- [ ] Create new Header.tsx component
- [ ] Move logo, Settings, and GitHub stars to Header
- [ ] Implement sticky positioning on scroll
- [ ] Add subtle shadow when scrolled
- [ ] Ensure glassmorphism styling maintained
- [ ] Update page.tsx to use Header component
- [ ] Test sticky behavior on long pages
- [ ] Add smooth transition for sticky state

**Files**:
- New: `components/Header.tsx`
- Update: `app/page.tsx:270-303`

**Acceptance Criteria**:
- [ ] Header extracted to separate component
- [ ] Sticks to top when scrolling
- [ ] Maintains glass aesthetic
- [ ] Shadow appears when scrolled
- [ ] All functionality preserved

---

## 🚀 LONG-TERM / COMPLEX PROJECTS

### Issue #13: Local Whisper Installation Setup
**Priority**: Low (Future)
**Complexity**: Very High
**Time Estimate**: 3-4 weeks

**Description**:
Create self-hosted version with local Whisper models (no API costs). Similar to n8n installation.

**Major Phases**:

**Phase 1: Research (Week 1)**
- [ ] Research whisper.cpp, faster-whisper, transformers.js
- [ ] Evaluate GPU acceleration options
- [ ] Choose best Whisper implementation
- [ ] Define system requirements

**Phase 2: Backend Development (Week 2)**
- [ ] Set up Python/Node backend
- [ ] Implement model download system
- [ ] Create transcription queue with workers
- [ ] Add GPU/CPU detection
- [ ] Build REST API for frontend
- [ ] Implement WebSocket for progress

**Phase 3: Installation & Packaging (Week 3)**
- [ ] Create Docker container
- [ ] Write installation scripts (Windows/Mac/Linux)
- [ ] Add auto-dependency installation
- [ ] Create desktop launcher
- [ ] Implement auto-update system

**Phase 4: Frontend Integration (Week 4)**
- [ ] Build local server mode
- [ ] Add model management UI
- [ ] Create system settings panel
- [ ] Add GPU/CPU toggle
- [ ] Implement batch processing UI
- [ ] Create installation docs

**Files**:
- New folder: `local-whisper-server/`
- New: `docs/local-installation.md`

**Technical Stack**:
- Backend: Python (FastAPI) or Node.js
- Whisper: whisper.cpp or faster-whisper
- Database: SQLite
- Frontend: Next.js (existing)
- Packaging: Docker, Electron

---

### Issue #14: Terminal/CLI Tool
**Priority**: Low (Future)
**Complexity**: High
**Time Estimate**: 2-3 weeks

**Description**:
Create standalone CLI tool for terminal-based transcription.

**Features**:
```bash
gigatranscript transcribe ./video.mp4
gigatranscript transcribe https://x.com/user/status/123
gigatranscript batch ./videos/
gigatranscript models list
gigatranscript config set apiKey sk-...
```

**Task Breakdown**:
- [ ] Set up CLI framework (Commander.js)
- [ ] Implement `transcribe` command
- [ ] Add batch processing support
- [ ] Create config management
- [ ] Add progress bars (cli-progress)
- [ ] Implement local Whisper support
- [ ] Add watch mode for new files
- [ ] Create npm package
- [ ] Write CLI documentation
- [ ] Publish to npm

**Files**:
- New folder: `cli/`
- New: `cli/package.json`
- New: `cli/src/index.ts`

---

### Issue #15: Project Whitepaper
**Priority**: Low
**Complexity**: Medium
**Time Estimate**: 1 week

**Description**:
Write comprehensive whitepaper explaining project vision, architecture, and roadmap.

**Task Breakdown**:
- [ ] Write project vision and goals section
- [ ] Document technical architecture
- [ ] Create comparison: Local vs Cloud transcription
- [ ] Explain privacy and security model
- [ ] Outline roadmap and future plans
- [ ] Add business model considerations
- [ ] Include diagrams and flowcharts
- [ ] Proofread and edit

**Files**:
- New: `WHITEPAPER.md`

---

## 📈 Sprint Planning

### Current Sprint (Week 1-2)
1. Issue #8: Fix Transcript Preview Display Bug ⚡
2. Issue #1: Modal Animations
3. Issue #5: API Key Management Improvements

### Next Sprint (Week 3-4)
1. Issue #2: Multi-Platform Video Support
2. Issue #6: Upload Video System
3. Issue #3: Settings UI Enhancement

### Month 2
1. Issue #9: Notion Integration
2. Issue #11: Landing Page Explanation Section
3. Issue #4: Title Animation
4. Issue #7: Social Media Logo Integration

### Long-term (Month 3+)
1. Issue #13: Local Whisper Installation
2. Issue #14: Terminal/CLI Tool
3. Issue #15: Project Whitepaper

---

## 🎯 Success Metrics

- **User Experience**: All modals animated, professional UI
- **Feature Completeness**: Multi-platform support, file uploads
- **Code Quality**: Components extracted, well-documented
- **Performance**: 60fps animations, fast transcription
- **Accessibility**: ARIA labels, keyboard navigation

---

*Project Plan Generated: October 30, 2025*
*Total Issues: 15*
*Estimated Timeline: 3-4 months for complete implementation*
