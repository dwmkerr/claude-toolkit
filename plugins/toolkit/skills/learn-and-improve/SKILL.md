---
name: learn-and-improve
description: This skill should be used when the user asks to "improve my setup", "learn from this session", "fix my config", "stop asking for permissions", or reports friction with skills, agents, hooks, or permissions. Analyzes conversation history and proposes configuration improvements.
allowed-tools: Read, Grep
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
| Convention not followed per-filetype | No path-scoped rule | `.claude/rules/` with paths frontmatter |
| Agent hitting permission walls | Agent lacks `permissionMode` | Agent frontmatter |
| MCP tool requiring permission | Missing MCP allow rule | settings.json `permissions.allow` |
| Hook not firing | Wrong matcher or event | settings.json `hooks` |

### Step 4: Propose Improvements

For each proposed improvement, present:

1. **What to change** — the specific file and content
2. **Why** — how this fixes the reported issue
3. **Who benefits** — see the table below to explain the reach of the improvement
4. **Risk** — any trade-offs (e.g., "this auto-allows all npm commands")

**Explain the reach of each improvement type to help the user decide:**

| Improvement Type | Best For | Who Benefits |
|-----------------|----------|--------------|
| Skill fix (external plugin) | Fixing behavior everyone hits — opens a PR upstream | All users of the skill |
| Skill fix (personal skill) | Your custom workflows across all projects | You, all projects |
| Agent fix (external plugin) | Agents that hit permission walls or use wrong model | All users of the agent |
| User-level settings | Permission rules and preferences that apply everywhere | You, all projects |
| User-level CLAUDE.md | Coding conventions and instructions you always want | You, all projects |
| Project-shared settings | Team permissions and conventions | Your team, one project |
| Project-shared CLAUDE.md | Architecture notes, project-specific patterns | Your team, one project |
| Project-local settings | Personal overrides for one project | Just you, one project |
| Hook | Automating repetitive steps (formatting, tests, safety) — delegate to `toolkit:claude-code-memory-and-hooks` skill | Depends on scope |
| Project rules (`.claude/rules/`) | File-type-scoped conventions (API rules, test rules, frontend rules) — delegate to `toolkit:claude-code-memory-and-hooks` skill for setup | Your team, one project |
| User rules (`~/.claude/rules/`) | Personal conventions across all projects | Just you, all projects |
| Auto memory | Session learnings that don't belong in CLAUDE.md — delegate to `toolkit:claude-code-memory-and-hooks` skill for setup | You, one project |

When an improvement could live at multiple scopes, present the options and explain the trade-off — broader scope means more reuse but also more risk if the change is wrong.

### Step 5: Apply the Change

Apply the approved change to the correct file. After applying:

1. Verify the file is valid JSON (for settings files) or valid markdown (for CLAUDE.md)
2. Tell the user if a restart is needed (hooks require restart; skills/CLAUDE.md do not)
3. If the fix is to an external skill or plugin, propose opening a PR instead

### Step 6: Record the Verified Improvement (ESSENTIAL)

Every user-approved improvement is a verified data point. This skill is self-improving — each fix makes it better for the next person.

After the user confirms the improvement works, append a summary to [Verified Improvements](./references/verified-improvements.md) using this format:

```markdown
### [Short title]
- **Friction**: [What went wrong]
- **Fix**: [What was changed and where]
- **Scope**: [Who benefits — e.g., "all users of toolkit:research"]
```

Keep entries concise (3 lines max). This log serves two purposes:
1. **Examples for future invocations** — Claude reads these to pattern-match similar problems faster
2. **Evidence for skill evolution** — patterns in the log reveal common friction that should be addressed in the skill itself or its references

If the log grows beyond ~30 entries, consolidate repeated patterns into the root cause table in Step 3 and remove the individual entries.

## Important Constraints

- **Never modify managed/enterprise settings** — those are IT-controlled
- **Always confirm before writing** — show the exact change first
- **Consider the reach** — explain who benefits from each improvement type so the user can choose the right scope
- **Preserve existing content** — merge into existing settings, don't overwrite
- **Settings format**: permission rules use `Tool(pattern)` syntax (e.g., `Bash(npm run *)`)

## Quick Reference

For the full catalog of improvement types and examples, see:
- [Improvement Types](./references/improvement-types.md) — all configuration levers with examples
- [Diagnostic Checklist](./references/diagnostic-checklist.md) — systematic investigation steps
