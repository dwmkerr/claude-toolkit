# Rules Guide

Detailed reference for `.claude/rules/` — modular, topic-specific instructions with optional path scoping.

## Structure

```
.claude/rules/
├── code-style.md
├── testing.md
├── security.md
├── frontend/
│   ├── react.md
│   └── styles.md
└── backend/
    ├── api.md
    └── database.md
```

All `.md` files are discovered recursively. Subdirectories are for organization only — they don't affect behavior.

## Path-Scoped Rules

Add `paths` frontmatter to scope rules to specific files:

```yaml
---
paths:
  - "src/api/**/*.ts"
---

# API Development Rules

- All API endpoints must include input validation
- Use the standard error response format
- Include OpenAPI documentation comments
```

Rules without `paths` are **unconditional** — they apply to all files.

Path-scoped rules only load when Claude is working with files matching the patterns.

## Glob Pattern Reference

| Pattern | Matches |
|---------|---------|
| `**/*.ts` | All TypeScript files in any directory |
| `src/**/*` | All files under src/ |
| `*.md` | Markdown files in the project root only |
| `src/components/*.tsx` | React components in a specific directory |
| `src/**/*.{ts,tsx}` | Both .ts and .tsx files under src/ |
| `{src,lib}/**/*.ts` | TypeScript in either src/ or lib/ |

Multiple patterns can be specified:

```yaml
---
paths:
  - "src/**/*.ts"
  - "lib/**/*.ts"
  - "tests/**/*.test.ts"
---
```

## Symlinks

The rules directory supports symlinks for sharing rules across projects:

```bash
# Symlink a shared rules directory
ln -s ~/shared-claude-rules .claude/rules/shared

# Symlink individual rule files
ln -s ~/company-standards/security.md .claude/rules/security.md
```

Symlinks are resolved normally. Circular symlinks are detected and handled.

## User-Level Rules

Personal rules at `~/.claude/rules/` apply to all your projects:

```
~/.claude/rules/
├── preferences.md     # Personal coding preferences
└── workflows.md       # Preferred workflows
```

User-level rules are loaded **before** project rules, giving project rules higher priority.

## Best Practices

- **One topic per file** — `testing.md`, `api-design.md`, not `everything.md`
- **Descriptive filenames** — the filename should indicate what the rules cover
- **Use path scoping sparingly** — only when rules truly apply to specific file types
- **Organize with subdirectories** — group related rules (`frontend/`, `backend/`)
- **Keep rules actionable** — "Use 2-space indentation" not "Format code properly"

## Rules vs CLAUDE.md

| | CLAUDE.md | .claude/rules/ |
|---|---|---|
| **Best for** | General project instructions, commands, architecture | Topic-specific guidelines |
| **File count** | One file | Many focused files |
| **Path scoping** | No | Yes (via frontmatter) |
| **Team workflow** | Single file to review | Easier to split ownership |
| **Discoverability** | One place to look | Need to check directory |

Use CLAUDE.md for project-wide instructions (build commands, architecture overview). Use rules for focused, maintainable guidelines that benefit from separation.
