---
name: claude-code-memory-and-hooks
description: This skill should be used when the user asks to "set up memory", "configure CLAUDE.md", "add rules", "create project rules", "organize instructions", "create a hook", "add a hook", "write a hook", or mentions Claude Code memory, CLAUDE.md files, .claude/rules, rules, hooks, or project instructions. Also use when the user wants to persist preferences, add coding conventions, scope instructions to specific files, understand when to use rules vs hooks, or "automatically do X" or "run X before/after Y".
allowed-tools: Read, Grep
---

# Claude Code Memory and Hooks

Configure Claude Code's memory system (CLAUDE.md, rules, auto memory) and hooks (shell automations and guardrails).

## Quick Reference

You MUST read the relevant references for detailed guidance:

**Memory:**
- [Memory Types](./references/memory-types.md) - All memory locations, scopes, and precedence
- [Rules Guide](./references/rules-guide.md) - Modular `.claude/rules/` with path scoping
- [Auto Memory](./references/auto-memory.md) - Claude's self-managed memory system
- [Examples](./references/examples.md) - Real-world memory and rules configurations

**Hooks:**
- [Hook Events Reference](./references/hook-events.md) - All events with input/output schemas
- [Examples: Firewall](./references/examples/firewall.md) - Block dangerous commands
- [Examples: Quality Checks](./references/examples/quality-checks.md) - Lint/format after edits
- [Examples: Pre-Push Tests](./references/examples/pre-push-tests.md) - Run tests before git push

## Rules vs Hooks

**Rules** (CLAUDE.md / `.claude/rules/`) are **instructions** — natural language that Claude interprets with judgment.

**Hooks** (`.claude/settings.json`) are **enforcement** — shell commands that execute deterministically on events.

```
Can Claude misinterpret or skip it?
├── Yes, and that's unacceptable → Hook (enforced)
├── Yes, but it's fine with judgment → Rule (guidance)
└── It's a shell command that should always run → Hook (automation)
```

| Need | Use |
|------|-----|
| "Always run prettier after editing" | Hook (PostToolUse on Edit) |
| "Use 2-space tabs in this project" | Rule — `.claude/rules/code-style.md` or `./CLAUDE.md` |
| "I prefer TypeScript over JavaScript" | Rule — `~/.claude/CLAUDE.md` (user-level) |
| "API routes must validate input" | Rule — `.claude/rules/api.md` with paths: `src/api/**` |
| "Never push to main" | Hook (PreToolUse on Bash, exit 2 for `git push.*main`) |
| "Run tests before git push" | Hook (PreToolUse on Bash) |
| "Block rm -rf /" | Hook (PreToolUse on Bash, exit 2) |
| "Remember the DB uses port 5433" | Auto memory or `./CLAUDE.local.md` |
| "All engineers must follow X policy" | Rule — Managed CLAUDE.md (org-level) |

Use rules for the 90% (guidance). Use hooks for the 10% (guardrails and automation).

---

## Memory

### Core Concepts

Claude Code has two kinds of persistent memory:

1. **CLAUDE.md files** — Markdown you write with instructions, rules, and preferences
2. **Auto memory** — Notes Claude writes for itself based on session learnings

Both load at session start. More specific instructions take precedence over broader ones.

### Memory Hierarchy

| Scope | Location | Shared With | Priority |
|-------|----------|-------------|----------|
| Organization | `/Library/Application Support/ClaudeCode/CLAUDE.md` | All org users | Lowest |
| User | `~/.claude/CLAUDE.md` | All your projects | |
| User rules | `~/.claude/rules/*.md` | All your projects | |
| Project (shared) | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Team via git | |
| Project rules | `./.claude/rules/*.md` | Team via git | |
| Project (local) | `./CLAUDE.local.md` | Just you | Highest |
| Auto memory | `~/.claude/projects/<project>/memory/` | Just you | Per-project |

CLAUDE.md files in parent directories are loaded in full at launch. Files in child directories load on demand when Claude reads files there.

### Choosing the Right Location

```
What do you need?
├── Instruction for ALL your projects?
│   ├── Shared with team? → Not possible at user level
│   └── Just you? → ~/.claude/CLAUDE.md or ~/.claude/rules/
├── Instruction for ONE project?
│   ├── Shared with team? → ./CLAUDE.md or .claude/rules/
│   └── Just you? → ./CLAUDE.local.md
├── Scoped to specific file types?
│   └── .claude/rules/<topic>.md with paths frontmatter
├── Session learnings that persist?
│   └── Auto memory (~/.claude/projects/<project>/memory/)
└── Organization-wide policy?
    └── Managed CLAUDE.md (deployed by IT)
```

### CLAUDE.md Structure

Keep instructions specific and actionable:

```markdown
# Project Instructions

## Build & Test
- Run tests: `npm test`
- Lint: `npm run lint`
- Build: `npm run build`

## Code Style
- Use 2-space indentation
- Prefer named exports over default exports
- All API endpoints must validate input

## Architecture
- API routes in src/api/, business logic in src/services/
- Database queries only in src/db/ — never in route handlers
```

**Tips:**
- "Use 2-space indentation" beats "Format code properly"
- Format each instruction as a bullet point
- Group related instructions under descriptive headings
- Review periodically as the project evolves

### Modular Rules (.claude/rules/)

For larger projects, split instructions into focused files instead of one large CLAUDE.md:

```
.claude/rules/
├── code-style.md       # Formatting and naming
├── testing.md          # Test conventions
├── security.md         # Security requirements
└── frontend/
    ├── react.md        # React patterns
    └── styles.md       # CSS conventions
```

All `.md` files are discovered recursively and loaded as project memory.

#### Path-Scoped Rules

Scope rules to specific files using `paths` frontmatter:

```yaml
---
paths:
  - "src/api/**/*.ts"
---

# API Rules

- All endpoints must include input validation
- Use the standard error response format
- Include OpenAPI documentation comments
```

Rules without `paths` apply to all files.

#### Glob Patterns

| Pattern | Matches |
|---------|---------|
| `**/*.ts` | All TypeScript files |
| `src/**/*` | All files under src/ |
| `*.md` | Markdown in project root |
| `src/**/*.{ts,tsx}` | TypeScript and TSX files |
| `{src,lib}/**/*.ts` | TypeScript in src/ or lib/ |

### CLAUDE.md Imports

Import files with `@path/to/file` syntax:

```markdown
See @README for project overview and @package.json for available npm commands.

# Git Workflow
- @docs/git-instructions.md
```

Relative paths resolve relative to the importing file. Max depth: 5 hops.

For personal instructions shared across worktrees:

```markdown
# My Preferences
- @~/.claude/my-project-instructions.md
```

### Bootstrapping

Run `/init` to generate an initial CLAUDE.md for your project. Then refine it.

Run `/memory` to open any memory file in your editor, toggle auto memory, or see what's loaded.

---

## Hooks

Hooks run shell commands on specific events to add guardrails, automations, and policy enforcement.

### Hook Types

1. **Command hooks** — Run bash scripts
2. **Prompt hooks** — Query LLM for context-aware decisions

### Exit Codes

| Code | Meaning | Behavior |
|------|---------|----------|
| 0 | Success | Action proceeds; stdout shown in verbose mode |
| 2 | Block | Action blocked; stderr fed to Claude |
| Other | Error | Non-blocking; stderr shown to user |

### File Locations

- Settings: `.claude/settings.json`
- Scripts: `.claude/hooks/` (mark executable)

### Settings Structure

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/my-script.sh",
            "timeout": 60
          }
        ]
      }
    ]
  }
}
```

### Hook Events Summary

| Event | When | Can Block? |
|-------|------|------------|
| PreToolUse | Before tool executes | Yes (exit 2) |
| PostToolUse | After tool completes | Feedback only |
| PermissionRequest | User sees permission dialog | Yes |
| UserPromptSubmit | User submits prompt | Yes |
| Stop | Main agent finishes | Yes (continue) |
| SubagentStop | Subagent finishes | Yes (continue) |
| SessionStart | Session begins | Add context |
| SessionEnd | Session ends | Cleanup only |
| Notification | Notifications sent | No |
| PreCompact | Before compact | No |

### Common Matchers

For PreToolUse/PostToolUse/PermissionRequest:
- `Bash` — Shell commands
- `Edit`, `Write`, `Read` — File operations
- `Glob`, `Grep` — Search operations
- `Task` — Subagent tasks
- `mcp__<server>__<tool>` — MCP tools
- Regex patterns supported

#### Wildcard Permissions

- `Bash(npm *)` — Match any npm command
- `Bash(*-h*)` — Match commands containing `-h`
- `Bash(git:*)` — Match any git subcommand

### Script Template

```bash
#!/usr/bin/env bash
set -euo pipefail

# Read JSON input
input=$(cat)
tool_name=$(echo "$input" | jq -r '.tool_name // ""')
command=$(echo "$input" | jq -r '.tool_input.command // ""')

# Your validation logic here
if [[ "$command" =~ dangerous_pattern ]]; then
  echo "Blocked: reason here" >&2
  exit 2
fi

exit 0
```

### Activating Hook Changes

Hooks are **snapshotted at startup**. After creating or modifying hooks:

> Changes won't take effect until you either:
> 1. **Restart Claude Code** (exit and re-run `claude`), OR
> 2. **Run `/hooks`** to review and apply the updated configuration

### Troubleshooting

1. **Did you restart?** Hooks are snapshotted at startup — run `/hooks` or restart Claude Code
2. **Check `/hooks` output** — Your hook should be listed with correct matcher
3. **Validate JSON** — Run `cat .claude/settings.json | jq .` to check syntax
4. **Check matcher** — Tool names are case-sensitive (`Bash` not `bash`)

Use `claude --debug` to see hook execution details.

## Attribution

- Memory: Based on [Claude Code Memory Documentation](https://code.claude.com/docs/en/memory)
- Hooks: Examples adapted from [Steve Kinney's Claude Code Hook Examples](https://stevekinney.com/courses/ai-development/claude-code-hook-examples)
