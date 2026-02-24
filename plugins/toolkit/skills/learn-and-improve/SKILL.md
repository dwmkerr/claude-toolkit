---
name: learn-and-improve
description: This skill should be used when the user asks to "improve my setup", "learn from this session", "fix my config", "stop asking for permissions", or reports friction with skills, agents, hooks, or permissions. Analyzes conversation history and proposes configuration improvements.
---

# Learn and Improve

Analyze friction in the current session and propose targeted improvements to Claude Code configuration.

## Workflow

### Step 1: Understand the Problem

Ask the user what went wrong. If they've already described the issue, confirm your understanding.

Use `AskUserQuestion` to clarify:
- **What happened?** (e.g., "skill X asked for permission to run Y")
- **What should have happened?** (e.g., "it should just run without asking")
- **How often does this occur?** (one-off vs recurring)

### Step 2: Gather Diagnostic Context

Investigate the current configuration by reading these files (read only what exists):

**Settings (permissions, hooks, env):**
- `~/.claude/settings.json` (user-level)
- `.claude/settings.json` (project-level, shared)
- `.claude/settings.local.json` (project-level, local)

**Memory (CLAUDE.md hierarchy):**
- `~/.claude/CLAUDE.md` (user-level)
- `./CLAUDE.md` or `./.claude/CLAUDE.md` (project-level)
- `./CLAUDE.local.md` (local overrides)
- `./.claude/rules/*.md` (modular rules)

**Auto memory:**
- `~/.claude/projects/*/memory/MEMORY.md` for the current project

**Plugins & skills:**
- `.claude-plugin/marketplace.json` (if in a plugin repo)
- Installed plugins: `~/.claude/plugins/cache/` (list directories)
- Installed marketplaces: `~/.claude/plugins/marketplaces/` (list directories)

**MCP servers:**
- `.mcp.json` (project)
- `~/.claude.json` or `~/.claude/mcp.json` (user)

Also review the conversation history for:
- Tool calls that were blocked or required permission prompts
- Skills that were invoked (or should have been but weren't)
- Agents that were spawned and their outcomes
- Error messages or unexpected behavior

### Step 3: Identify the Root Cause

Common root causes and their fixes — see [Improvement Types](./references/improvement-types.md) for full details.

| Symptom | Likely Cause | Fix Location |
|---------|-------------|--------------|
| Permission prompt for a bash command | Missing `allow` rule | settings.json `permissions.allow` |
| Permission prompt for file read/write | Missing path pattern | settings.json `permissions.allow` |
| Skill not triggering | Bad description triggers | Skill SKILL.md frontmatter |
| Skill triggering on wrong tasks | Description too broad | Skill SKILL.md frontmatter |
| Repeated instructions ignored | Not in CLAUDE.md | CLAUDE.md (appropriate level) |
| Agent hitting permission walls | Agent lacks `permissionMode` | Agent frontmatter |
| MCP tool requiring permission | Missing MCP allow rule | settings.json `permissions.allow` |
| Hook not firing | Wrong matcher or event | settings.json `hooks` |

### Step 4: Propose Improvements

Present a clear proposal with:

1. **What to change** — the specific file and content
2. **Why** — how this fixes the reported issue
3. **Scope** — whether this is user-level, project-level, or skill-level
4. **Risk** — any trade-offs (e.g., "this auto-allows all npm commands")

Use `AskUserQuestion` to confirm before making changes:

```
Where should this improvement live?
- User-level (~/.claude/settings.json) — applies to all projects
- Project-level (.claude/settings.json) — shared with team
- Project-local (.claude/settings.local.json) — just for you, this project
```

### Step 5: Apply the Change

Apply the approved change to the correct file. After applying:

1. Verify the file is valid JSON (for settings files) or valid markdown (for CLAUDE.md)
2. Tell the user if a restart is needed (hooks require restart; skills/CLAUDE.md do not)
3. If the fix is to an external skill or plugin, propose opening a PR instead

## Important Constraints

- **Never modify managed/enterprise settings** — those are IT-controlled
- **Always confirm before writing** — show the exact change first
- **Prefer the narrowest scope** — project-local over user-level when possible
- **Preserve existing content** — merge into existing settings, don't overwrite
- **Settings format**: permission rules use `Tool(pattern)` syntax (e.g., `Bash(npm run *)`)

## Quick Reference

For the full catalog of improvement types and examples, see:
- [Improvement Types](./references/improvement-types.md) — all configuration levers with examples
- [Diagnostic Checklist](./references/diagnostic-checklist.md) — systematic investigation steps
