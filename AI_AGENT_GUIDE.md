# AI Agent Guide - GigaTranscript Project

**For AI Models Working on This Project**

This guide contains critical instructions for AI agents (Claude, GPT, etc.) working on the GigaTranscript codebase. Follow these rules to maintain project organization and progress tracking.

---

## 📁 Critical Project Files

### @PROGRESS.md
**Location**: `/PROGRESS.md`

**Purpose**: The single source of truth for project progress and TODOs.

**What It Contains**:
- ✅ Completed features (with completion dates)
- 📋 High Priority TODOs (issues 1-10)
- 📊 Medium Priority TODOs (issues 11-14)
- 🚀 Long-term Projects (issues 15-17)
- 📈 Progress metrics and completion status
- 🎯 Sprint planning and focus areas

**When to Update**:
- ✅ Mark issue as COMPLETED when finished (add ✅ emoji + completion date)
- 📝 Add new issues when requested by user
- 📊 Update progress metrics after completing issues
- 🔄 Update "Core Features" section when major features are added

**Example Update**:
```markdown
#### 1. **Import Title from Source** 📝 ✅ COMPLETED
- [x] Extract video title from Twitter/X API
- [x] Display title in queue items instead of just URL
- [x] Show title in transcript preview modal
- **Files**: `lib/videoExtractor.ts`, `app/page.tsx`
- **Completed**: October 30, 2025
```

---

### @USER-INSTRUCTIONS.md
**Location**: `/USER-INSTRUCTIONS.md`

**Purpose**: TODOs that require human action (API keys, account setup, configurations).

**What to Write Here**:
- 🔑 API key setup instructions
- 🌐 Account creation steps (RapidAPI, OpenAI, etc.)
- ⚙️ Configuration that needs manual setup
- 🔐 Security-related tasks
- 💳 Payment/subscription setups

**When to Update**:
- When you encounter a task you cannot complete (API key needed, account required)
- When user needs to perform manual configuration
- When external service setup is required

**Format**:
```markdown
## TODO for User: [Task Name]

**Action Required**: [What user needs to do]

**Steps**:
1. Go to [URL]
2. Create account / Get API key
3. Add to `.env.local`: `KEY_NAME=value`
4. Restart dev server

**Priority**: High/Medium/Low
**Blocking**: [What features are blocked by this]
```

---

### @"Project Managment/FUNCTIONALITY.md"
**Location**: `/Project Managment/FUNCTIONALITY.md`

**Purpose**: Technical specification and architecture documentation.

**When to Update**:
- 🎯 When BIG features are added (not small bug fixes)
- 🏗️ When architecture changes significantly
- 🔄 When API integrations are added/modified
- 📊 When new major workflows are implemented

**Examples of Updates**:
- ✅ Multi-platform support added → Update "Video Extraction Pipeline"
- ✅ Upload system added → Add new "File Upload Workflow" section
- ✅ Notion integration → Add "Notion API Integration" section

**Don't Update For**:
- Small UI changes
- Bug fixes
- Minor refactoring
- Style updates

---

## 🔄 Git Commit & Push Rules

### **CRITICAL RULE: Commit Frequently, But Smart**

#### When to Commit:
- ✅ After completing **4+ code changes** in different files
- ✅ After completing a logical unit of work (even if 1-3 files)
- ✅ After fixing a bug
- ✅ After implementing a complete feature
- ✅ **At the end of a request**, even if 8+ changes were made

#### Commit Message Format:
```bash
git add .
git commit -m "$(cat <<'EOF'
[Type]: Brief description of changes

- Specific change 1
- Specific change 2
- Specific change 3

Files modified:
- file1.tsx
- file2.ts

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
git push origin main
```

**Types**:
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code refactoring
- `style:` UI/styling changes
- `docs:` Documentation updates
- `chore:` Maintenance tasks

#### Examples:

**Example 1: Single Request with 4 Changes**
```bash
# User: "Add modal animations"
# You modify: app/page.tsx, package.json, components/AnimatedModal.tsx

git add .
git commit -m "$(cat <<'EOF'
feat: Add Framer Motion animations to modals

- Install framer-motion package
- Add fade-in animation to Settings modal (300ms)
- Add slide-up animation to Transcript modal (400ms)
- Click outside modal to close

Files modified:
- app/page.tsx
- package.json
- components/AnimatedModal.tsx

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
git push origin main
```

**Example 2: Single Request with 8+ Changes**
```bash
# User: "Add multi-platform support"
# You modify 8 files: videoExtractor.ts, platformDetector.ts, types.ts, etc.

# Complete ALL changes first, then ONE commit at the end:

git add .
git commit -m "$(cat <<'EOF'
feat: Add multi-platform video support (TikTok, Instagram, YouTube, Vimeo)

- Create platform detection from URL
- Implement TikTok video extractor
- Implement Instagram video extractor
- Implement YouTube video extractor
- Implement Vimeo video extractor
- Update VideoInfo type with platform field
- Add platform icons to queue items
- Update URL validation for all platforms

Files modified:
- lib/videoExtractor.ts
- lib/platformDetector.ts
- lib/types.ts
- app/page.tsx
- public/icons/tiktok.svg
- public/icons/instagram.svg
- public/icons/youtube.svg
- public/icons/vimeo.svg

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
git push origin main
```

#### What NOT to Do:
- ❌ Don't commit after EVERY single file change
- ❌ Don't make 8 separate commits for 1 feature
- ❌ Don't forget to push after committing
- ❌ Don't use vague commit messages like "update code"

---

## 📊 Linear Integration

### Every 5 Completed Issues → Sync to Linear

**When**: After marking 5 issues as COMPLETED in @PROGRESS.md

**How**: Use Linear MCP Server tools to mark issues as done

**Steps**:
1. Count completed issues in @PROGRESS.md since last sync
2. If count >= 5, trigger Linear sync
3. Use your Linear MCP tools to:
   - Find issues in Linear project
   - Mark them as "Done" status
   - Add completion date
   - Add comment with details

**Note**: You have Linear MCP Server available. Use the appropriate MCP tools to interact with Linear. Don't specify exact commands - just use your MCP capabilities.

**What to Sync**:
- Issue title
- Completion date
- Links to relevant commits
- Final implementation notes

---

## 📝 Linear Issues Creation

See `LINEAR_SYNC.md` for detailed instructions on creating and syncing issues with Linear.

**Quick Reference**:
- Create Linear project if it doesn't exist
- Import all issues from @PROGRESS.md
- Use Linear MCP tools for all operations
- Keep Linear and @PROGRESS.md in sync

---

## 🎯 Workflow for AI Agents

### Starting a New Task

1. **Read @PROGRESS.md** to understand current status
2. **Check @USER-INSTRUCTIONS.md** for any blockers
3. **Identify the issue** you're working on
4. **Update @PROGRESS.md** to mark issue as in-progress (optional)

### During Implementation

1. **Make code changes** logically and incrementally
2. **Test changes** if possible
3. **Keep track** of files modified

### After Completing Task

1. **Update @PROGRESS.md**:
   - Mark issue as ✅ COMPLETED
   - Add completion date
   - List modified files
   - Add any special notes

2. **Update @USER-INSTRUCTIONS.md** (if needed):
   - Add any tasks that require user action
   - Document API keys needed
   - Note configuration requirements

3. **Update @"Project Managment/FUNCTIONALITY.md"** (if BIG feature):
   - Add new sections for major features
   - Update architecture diagrams
   - Document new workflows

4. **Git Commit & Push**:
   - Follow commit rules above
   - Use proper format
   - Push to origin main

5. **Linear Sync** (if applicable):
   - Count completed issues
   - If >= 5, sync to Linear using MCP

---

## 🚨 Important Reminders

### Always Reference Files
When discussing progress or changes, always reference:
- ✅ "Updated @PROGRESS.md to mark issue #2 as completed"
- ✅ "Check @USER-INSTRUCTIONS.md for RapidAPI setup"
- ✅ "Big feature added - updated @'Project Managment/FUNCTIONALITY.md'"

### Progress Metrics
Keep the progress metrics in @PROGRESS.md up-to-date:
```markdown
### Completion Status
- **Total Features**: 17
- **Completed**: 13 ✅
- **In Progress**: 0
- **TODO**: 14
```

### Sprint Focus
Always check the "Current Sprint Focus" in @PROGRESS.md to prioritize work.

---

## 📋 Checklist for Completing an Issue

- [ ] All code changes implemented
- [ ] Code tested (if possible)
- [ ] @PROGRESS.md updated with ✅ and completion date
- [ ] @USER-INSTRUCTIONS.md updated (if human action needed)
- [ ] @"Project Managment/FUNCTIONALITY.md" updated (if big feature)
- [ ] Git commit created with proper format
- [ ] Changes pushed to origin main
- [ ] Linear synced (if 5+ issues completed)
- [ ] User notified of completion

---

## 🎓 Examples of Good Practice

### Example 1: Completing Modal Animations

**Code Changes**: 4 files modified
**Action**:
1. ✅ Implemented Framer Motion animations
2. ✅ Updated @PROGRESS.md:
   ```markdown
   #### 2. **Modal Animations** ✨ ✅ COMPLETED
   - [x] Add smooth open/close animations for modals
   - **Completed**: October 30, 2025
   ```
3. ✅ Committed with proper format
4. ✅ Pushed to main

### Example 2: Notion Integration (Big Feature)

**Code Changes**: 6 files created/modified
**Action**:
1. ✅ Implemented Notion OAuth and API integration
2. ✅ Updated @PROGRESS.md (marked as completed)
3. ✅ Updated @USER-INSTRUCTIONS.md:
   ```markdown
   ## TODO: Create Notion Integration

   **Steps**:
   1. Go to notion.so/my-integrations
   2. Create new integration
   3. Add to .env.local: NOTION_API_KEY=...
   ```
4. ✅ Updated @"Project Managment/FUNCTIONALITY.md":
   ```markdown
   ### Notion Integration
   - OAuth 2.0 flow
   - Export transcripts to Notion databases
   - Token management
   ```
5. ✅ Committed and pushed

### Example 3: Bug Fix

**Code Changes**: 1 file
**Action**:
1. ✅ Fixed transcript preview display bug
2. ✅ Updated @PROGRESS.md (marked issue #10 as completed)
3. ✅ Committed: `fix: Display transcript text in preview modal`
4. ✅ Pushed to main

---

## 🔗 Related Files

- `LINEAR_SYNC.md` - Linear integration instructions
- `LINEAR_PROJECT_PLAN.md` - Project plan template for Linear
- `PROGRESS.md` - Main progress tracker
- `USER-INSTRUCTIONS.md` - User action items
- `Project Managment/FUNCTIONALITY.md` - Technical documentation

---

**Remember**: The goal is to maintain clear progress tracking, proper git history, and synchronized Linear issues. Follow these guidelines consistently!

---

*Last Updated: October 30, 2025*
*For AI Agents working on GigaTranscript*
