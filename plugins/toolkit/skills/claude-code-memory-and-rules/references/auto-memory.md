# Auto Memory

Claude's self-managed memory system for persisting learnings across sessions.

## Overview

Auto memory is a directory where Claude records patterns, insights, and preferences it discovers during sessions. Unlike CLAUDE.md (instructions you write for Claude), auto memory contains notes Claude writes for itself.

Enabled by default. Toggle with `/memory`.

## What Claude Remembers

- **Project patterns**: build commands, test conventions, code style preferences
- **Debugging insights**: solutions to tricky problems, common error causes
- **Architecture notes**: key files, module relationships, important abstractions
- **Your preferences**: communication style, workflow habits, tool choices

## Storage Location

Each project gets its own memory directory:

```
~/.claude/projects/<project>/memory/
├── MEMORY.md          # Concise index (first 200 lines loaded at startup)
├── debugging.md       # Detailed debugging notes
├── api-conventions.md # API design decisions
└── ...                # Any topic files Claude creates
```

The `<project>` path is derived from the git repository root. All subdirectories within the same repo share one memory directory. Git worktrees get separate directories. Outside a git repo, the working directory is used.

## How It Works

1. First **200 lines** of `MEMORY.md` are loaded into Claude's system prompt at session start
2. Content beyond 200 lines is **not loaded automatically**
3. Topic files (`debugging.md`, `patterns.md`) are **not loaded at startup** — Claude reads them on demand
4. Claude reads and writes memory files during your session

## Managing Auto Memory

### Via Claude

Tell Claude directly:
- "remember that we use pnpm, not npm"
- "save to memory that the API tests require a local Redis instance"

### Via /memory

Run `/memory` to:
- Open any memory file in your editor
- Toggle auto memory on/off
- See what's currently loaded

### Via Settings

Disable for all projects:
```json
// ~/.claude/settings.json
{ "autoMemoryEnabled": false }
```

Disable for one project:
```json
// .claude/settings.json
{ "autoMemoryEnabled": false }
```

### Via Environment Variable

Overrides all other settings:
```bash
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=1  # Force off
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=0  # Force on
```

## Best Practices

- Keep `MEMORY.md` concise — it's an index, not a journal
- Move detailed notes into topic files
- Claude manages this automatically, but you can edit files anytime
- Review periodically to remove stale information

## Auto Memory vs CLAUDE.md

| | Auto Memory | CLAUDE.md |
|---|---|---|
| **Written by** | Claude | You |
| **Purpose** | Session learnings | Instructions and rules |
| **Loaded at startup** | First 200 lines of MEMORY.md | Full file |
| **Shared with team** | No | Yes (project-level) |
| **Version controlled** | No | Yes (project-level) |
| **Best for** | Patterns Claude discovers | Rules you want enforced |
