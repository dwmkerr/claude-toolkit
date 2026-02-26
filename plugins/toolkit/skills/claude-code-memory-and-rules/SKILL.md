---
name: claude-code-memory-and-rules
description: This skill should be used when the user asks to "set up memory", "configure CLAUDE.md", "add rules", "create project rules", "organize instructions", or mentions Claude Code memory, CLAUDE.md files, .claude/rules, rules, or project instructions. Also use when the user wants to persist preferences, add coding conventions, scope instructions to specific files, or understand when to use rules vs hooks or other memory mechanisms.
allowed-tools: Read, Grep
---

# Claude Code Memory and Rules

Configure Claude Code's memory system — CLAUDE.md files, modular rules, and auto memory — so instructions persist across sessions.

## Quick Reference

You MUST read these references for detailed guidance:

- [Memory Types](./references/memory-types.md) - All memory locations, scopes, and precedence
- [Rules Guide](./references/rules-guide.md) - Modular `.claude/rules/` with path scoping
- [Auto Memory](./references/auto-memory.md) - Claude's self-managed memory system
- [Examples](./references/examples.md) - Real-world memory and rules configurations

## Core Concepts

Claude Code has two kinds of persistent memory:

1. **CLAUDE.md files** — Markdown you write with instructions, rules, and preferences
2. **Auto memory** — Notes Claude writes for itself based on session learnings

Both load at session start. More specific instructions take precedence over broader ones.

## Memory Hierarchy

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

## Choosing the Right Location

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
├── Automated enforcement (not guidance)?
│   └── Hook — use the claude-code-hook-development skill
└── Organization-wide policy?
    └── Managed CLAUDE.md (deployed by IT)
```

## Rules vs Hooks

**Rules** (CLAUDE.md / `.claude/rules/`) are **instructions** — natural language that Claude interprets with judgment.

**Hooks** (`.claude/settings.json`) are **enforcement** — shell commands that execute deterministically on events. Use the `claude-code-hook-development` skill for hooks.

| Need | Use |
|------|-----|
| "Use 2-space tabs in this project" | Rule — `.claude/rules/code-style.md` or `./CLAUDE.md` |
| "I prefer TypeScript over JavaScript" | Rule — `~/.claude/CLAUDE.md` (user-level) |
| "API routes must validate input" | Rule — `.claude/rules/api.md` with paths: `src/api/**` |
| "Remember the DB uses port 5433" | Auto memory or `./CLAUDE.local.md` |
| "All engineers must follow X policy" | Rule — Managed CLAUDE.md (org-level) |
| "Always run prettier after editing" | Hook — use `claude-code-hook-development` skill |
| "Never push to main" | Hook — use `claude-code-hook-development` skill |
| "Block rm -rf /" | Hook — use `claude-code-hook-development` skill |

Use rules for the 90% (guidance). Use hooks for the 10% (guardrails and automation).

## CLAUDE.md Structure

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

## Modular Rules (.claude/rules/)

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

### Path-Scoped Rules

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

### Glob Patterns

| Pattern | Matches |
|---------|---------|
| `**/*.ts` | All TypeScript files |
| `src/**/*` | All files under src/ |
| `*.md` | Markdown in project root |
| `src/**/*.{ts,tsx}` | TypeScript and TSX files |
| `{src,lib}/**/*.ts` | TypeScript in src/ or lib/ |

## CLAUDE.md Imports

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

## Bootstrapping

Run `/init` to generate an initial CLAUDE.md for your project. Then refine it.

Run `/memory` to open any memory file in your editor, toggle auto memory, or see what's loaded.

## Attribution

Based on [Claude Code Memory Documentation](https://code.claude.com/docs/en/memory).
