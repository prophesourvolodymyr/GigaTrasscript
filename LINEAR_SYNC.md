# Linear Sync Guide - GigaTranscript

**Syncing Issues Between @PROGRESS.md and Linear**

This guide explains how to create Linear issues from @PROGRESS.md and keep them synchronized.

---

## 🎯 Overview

**Purpose**: Keep Linear project board in sync with @PROGRESS.md

**When to Sync**:
1. Initial setup: Import all issues from @PROGRESS.md to Linear
2. Every 5 completed issues: Mark them as done in Linear
3. When new issues added: Create them in Linear
4. When issues updated: Update Linear accordingly

---

## 📋 Initial Setup: Create Linear Project & Import Issues

### Step 1: Create Linear Project (If Not Exists)

**Use your Linear MCP tools** to:
1. Check if "GigaTranscript" project exists in Personal team
2. If not, create new project:
   - **Name**: GigaTranscript
   - **Team**: Personal
   - **Description**: "Open-source Twitter/X video transcription tool with queue system, glassmorphism UI, and OpenAI Whisper integration"
   - **Status**: Active

### Step 2: Import All Issues from @PROGRESS.md

**Source**: Read all TODOs from `/PROGRESS.md`

**Process**:
1. Open @PROGRESS.md
2. Extract all uncompleted issues (sections marked with `- [ ]`)
3. For each issue, create Linear issue with:
   - **Title**: Issue name (e.g., "Multi-Platform Video Support")
   - **Description**: Full issue details from PROGRESS.md
   - **Priority**: Based on section (High/Medium/Low)
   - **Labels**: Add appropriate labels (bug, feature, enhancement)
   - **Project**: GigaTranscript

**Use Linear MCP Tools** - Don't manually specify commands, use your available MCP capabilities to:
- Create issues
- Set priorities
- Add descriptions
- Link to project
- Add labels

---

## 📝 Issue Mapping

### High Priority Issues → Linear Priority: Urgent/High

From @PROGRESS.md:
- Issue #3: Multi-Platform Video Support
- Issue #5: Settings UI Enhancement
- Issue #6: Title Animation
- Issue #7: API Key Management Improvements
- Issue #8: Upload Video System
- Issue #9: Social Media Logo Integration
- Issue #10: Fix Transcript Preview Display Bug

### Medium Priority Issues → Linear Priority: Medium

- Issue #11: Notion Integration
- Issue #12: Sync Text Copy Window UI
- Issue #13: Landing Page Explanation Section
- Issue #14: Create Header Component

### Long-term Projects → Linear Priority: Low

- Issue #15: Local Whisper Installation Setup
- Issue #16: Develop Terminal/CLI Tool
- Issue #17: Project Whitepaper

---

## 🔄 Syncing Completed Issues

### Every 5 Completed Issues

**Trigger**: When 5+ issues marked as ✅ COMPLETED in @PROGRESS.md

**Process**:
1. Count completed issues since last sync
2. If count >= 5:
   - Use Linear MCP to find corresponding issues
   - Mark each as "Done" status
   - Add completion date to description
   - Add comment: "Completed on [date]. See commit [hash]"

**Use Linear MCP Tools** to:
- Search for issues by title
- Update issue status
- Add comments
- Update custom fields

---

## 📊 Creating New Issues

**When**: User requests new feature or bug is discovered

**Steps**:
1. Add issue to @PROGRESS.md in appropriate priority section
2. Immediately create corresponding Linear issue
3. Link Linear issue ID back to PROGRESS.md (optional)

**Format in PROGRESS.md**:
```markdown
#### X. **New Feature Name** 🎯
- [ ] Task 1
- [ ] Task 2
- **Files**: `file1.ts`, `file2.tsx`
- **Linear**: `PROJ-123` (optional)
```

---

## 🎯 Linear Issue Template

When creating issues in Linear, use this format:

**Title**: `[Component] - Brief description`

Example: `[Video Extraction] - Add multi-platform support`

**Description Template**:
```markdown
## Overview
[Description of what needs to be done]

## Task Breakdown

- [ ] Subtask 1
- [ ] Subtask 2
- [ ] Subtask 3

## Files to Modify

- `file1.ts`
- `file2.tsx`
- `file3.tsx`

## Acceptance Criteria

- [ ] Feature works as expected
- [ ] Tests passing
- [ ] Code follows project patterns
- [ ] User verified

## Context

Related issues: [Link if applicable]
Progress tracker: See @PROGRESS.md issue #X

---
*Imported from @PROGRESS.md*
```

---

## 🔧 Using Linear MCP Server

### Available Operations

**You have Linear MCP Server available.** Use it to:

1. **List Projects**
   - Find "GigaTranscript" project
   - Check if it exists
   - Get project ID

2. **Create Issues**
   - Create new issues in project
   - Set title, description, priority
   - Assign to project

3. **Update Issues**
   - Change status (Todo → In Progress → Done)
   - Update descriptions
   - Add comments

4. **Search Issues**
   - Find issues by title
   - Filter by status
   - Get issue details

5. **Batch Operations**
   - Mark multiple issues as done
   - Update multiple priorities
   - Bulk import

**Note**: Use your MCP tools directly. Don't hardcode specific command syntax.

---

## 📅 Sync Schedule

### Recommended Sync Points

1. **Daily**:
   - Check for new completed issues
   - Update Linear status

2. **After Each Feature**:
   - Mark Linear issue as done
   - Add completion notes

3. **Every 5 Completions**:
   - Batch sync to Linear
   - Update project progress

4. **Weekly**:
   - Review all issues
   - Ensure Linear matches @PROGRESS.md
   - Clean up stale issues

---

## ✅ Verification Checklist

After syncing, verify:

- [ ] All issues from @PROGRESS.md exist in Linear
- [ ] Completed issues marked as "Done" in Linear
- [ ] Priorities match between @PROGRESS.md and Linear
- [ ] Project "GigaTranscript" contains all issues
- [ ] Issue descriptions are complete
- [ ] Labels applied correctly

---

## 🔗 Bidirectional Sync

### @PROGRESS.md → Linear
- New issues created in @PROGRESS.md → Create in Linear
- Issues completed in @PROGRESS.md → Mark done in Linear
- Priority changed in @PROGRESS.md → Update in Linear

### Linear → @PROGRESS.md
- Status changes in Linear → Update @PROGRESS.md (manual)
- New issues in Linear → Add to @PROGRESS.md (if needed)
- Comments in Linear → Reference in @PROGRESS.md (optional)

**Note**: @PROGRESS.md is the source of truth. Linear is for project management visualization.

---

## 🎓 Examples

### Example 1: Initial Import

**Scenario**: First time setting up Linear sync

**Steps**:
1. Use Linear MCP to check if project exists
2. Create "GigaTranscript" project if needed
3. Read all issues from @PROGRESS.md
4. For each issue, create Linear issue using MCP
5. Store mapping (optional)

**Result**: 14 uncompleted issues now in Linear

---

### Example 2: Marking 5 Issues Complete

**Scenario**: Completed issues #1, #2, #4, #10, #12

**Steps**:
1. Count completions in @PROGRESS.md: 5 issues
2. Use Linear MCP to search for each issue by title
3. Update status to "Done" for all 5
4. Add completion dates in Linear
5. Add comments with commit hashes

**Result**: Linear shows 5 issues moved to "Done" column

---

### Example 3: Adding New Issue

**Scenario**: User requests new feature "Dark Mode Toggle"

**Steps**:
1. Add to @PROGRESS.md:
   ```markdown
   #### 18. **Dark Mode Toggle** 🌙
   - [ ] Create theme context
   - [ ] Add toggle button in header
   - **Priority**: Medium
   ```

2. Use Linear MCP to create issue:
   - Title: "[UI] - Dark Mode Toggle"
   - Description: Full details from @PROGRESS.md
   - Priority: Medium
   - Project: GigaTranscript

3. (Optional) Add Linear ID to @PROGRESS.md

**Result**: New issue tracked in both places

---

## 🚨 Important Notes

### Source of Truth
**@PROGRESS.md** is the primary source of truth.
Linear is a visualization and project management tool.

### When in Conflict
If Linear and @PROGRESS.md don't match:
1. Check @PROGRESS.md for latest status
2. Update Linear to match
3. Never override @PROGRESS.md from Linear

### Automation
This sync process can be:
- **Manual**: AI agent runs sync when needed
- **Semi-automatic**: Every 5 completions trigger sync
- **Automatic**: Future GitHub Actions workflow

---

## 📁 Related Files

- `AI_AGENT_GUIDE.md` - General guidelines for AI agents
- `PROGRESS.md` - Main progress tracker (source of truth)
- `LINEAR_PROJECT_PLAN.md` - Template for Linear project structure
- `USER-INSTRUCTIONS.md` - User action items

---

## 🎯 Quick Reference Commands

**For AI Agents Using MCP**:

1. Create project → Use Linear MCP create project tool
2. Create issue → Use Linear MCP create issue tool
3. Update status → Use Linear MCP update issue tool
4. Search issues → Use Linear MCP search tool
5. List projects → Use Linear MCP list projects tool

**Don't hardcode specific MCP commands** - use your available Linear MCP capabilities.

---

*Last Updated: October 30, 2025*
*For syncing GigaTranscript issues with Linear*
