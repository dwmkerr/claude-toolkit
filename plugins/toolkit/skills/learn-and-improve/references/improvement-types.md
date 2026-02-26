# Improvement Types

Full catalog of configuration levers for resolving common friction points.

## 1. Permission Rules

**File:** `settings.json` (user, project, or local scope)

**Format:**
```json
{
  "permissions": {
    "allow": ["Bash(npm run *)", "Read(src/**)"],
    "deny": ["Bash(rm -rf *)"],
    "ask": []
  }
}
```

**Pattern syntax:**
- `Bash(npm *)` — wildcard matching on bash commands
- `Read(src/**)` — gitignore-style path patterns
- `Edit(src/**)` — same for edit operations
- `WebFetch(domain:example.com)` — domain filtering
- `mcp__server__tool` — MCP tool rules (supports regex)
- `Task(Explore)` — subagent rules

**Evaluation order:** deny > ask > allow (first match wins)

**Common permission fixes:**

| Friction | Rule to Add |
|----------|------------|
| "Allow npm commands" | `Bash(npm *)` |
| "Allow git commands" | `Bash(git *)` |
| "Allow reading all project files" | `Read(**)` |
| "Allow MCP tool X" | `mcp__servername__toolname` |
| "Allow running tests" | `Bash(npm test)`, `Bash(pytest *)` |
| "Allow make targets" | `Bash(make *)` |

## 2. CLAUDE.md Instructions

**Scope hierarchy (most specific wins):**

| Level | File | Shared? |
|-------|------|---------|
| Organization | `/Library/Application Support/ClaudeCode/CLAUDE.md` | All users |
| Project (shared) | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Team via git |
| Project rules | `./.claude/rules/*.md` | Team via git |
| User | `~/.claude/CLAUDE.md` | All your projects |
| Project (local) | `./CLAUDE.local.md` | Just you |

**When to add CLAUDE.md entries:**
- Coding conventions Claude keeps forgetting
- Preferred tools or workflows
- Project-specific architecture notes
- "Always do X" or "never do Y" instructions

**Path-scoped rules** (in `.claude/rules/*.md`):
```yaml
---
paths:
  - "src/api/**/*.ts"
---
# Only applies when working with API files
```

## 3. Skill Modifications

**Frontmatter fields that control behavior:**

```yaml
---
name: my-skill
description: Triggers and purpose
context: fork              # Run in isolated subagent
user-invocable: true       # Show in slash menu
allowed-tools: "Read Grep" # Restrict available tools
model: haiku               # Override model
---
```

**Common skill fixes:**

| Issue | Fix |
|-------|-----|
| Skill asks for permissions | Add `allowed-tools` or update agent `permissionMode` |
| Skill triggers on wrong tasks | Narrow the `description` triggers |
| Skill doesn't trigger | Add specific trigger phrases to `description` |
| Skill too slow | Set `model: haiku` or move content to `references/` |
| Skill side effects | Add `context: fork` to isolate |

## 4. Agent Configuration

**Frontmatter fields:**

```yaml
---
name: my-agent
description: What the agent does
tools: WebSearch, WebFetch, Read, Bash, Glob, Grep, Write
model: sonnet
skills: research
permissionMode: bypassPermissions
---
```

**`permissionMode` options:**
- `default` — follows user's permission settings
- `bypassPermissions` — no permission prompts (use for autonomous agents)

## 5. Hook Configuration

**When hooks help:**
- Auto-formatting after file edits
- Blocking dangerous commands
- Injecting context at session start
- Running tests before git push

**Example: Auto-allow pattern via PreToolUse hook:**
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{
          "type": "command",
          "command": "echo '{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"allow\"}}'"
        }]
      }
    ]
  }
}
```

**Note:** Hook changes require a Claude Code restart or `/hooks` refresh.

## 6. MCP Server Configuration

**File:** `.mcp.json` (project) or `~/.claude.json` (user)

**Permission for MCP tools:**
```json
{
  "permissions": {
    "allow": ["mcp__github__create_pull_request"]
  }
}
```

## 7. Plugin Updates

**For skills/agents in installed plugins:**
- Local plugins: edit files directly in the plugin source
- Marketplace plugins: fork the repo, make changes, open a PR
- Cache location: `~/.claude/plugins/cache/<marketplace>/<plugin>/<version>/`

**To apply changes to cached plugins:**
```bash
rm -rf ~/.claude/plugins/cache/<plugin-name>
claude plugin install <plugin>@<marketplace>
```

## 8. Auto Memory Updates

**File:** `~/.claude/projects/<project>/memory/MEMORY.md`

Use auto memory for learnings that should persist across sessions but don't belong in CLAUDE.md (e.g., project-specific debugging patterns, file locations).

## Decision Tree

```
Friction reported
├── Permission prompt?
│   ├── Bash command → settings.json permissions.allow
│   ├── File access → settings.json permissions.allow with path pattern
│   ├── MCP tool → settings.json permissions.allow with mcp__ prefix
│   └── Agent spawning → Agent frontmatter permissionMode
├── Instruction not followed?
│   ├── One project → CLAUDE.md (project level)
│   ├── All projects → ~/.claude/CLAUDE.md (user level)
│   ├── Specific file types → .claude/rules/ with paths frontmatter
│   └── Use toolkit:claude-code-memory-and-hooks skill for setup
├── Skill behavior wrong?
│   ├── Triggering issue → Skill description frontmatter
│   ├── Too many permissions → Skill allowed-tools
│   └── Side effects → Skill context: fork
├── Want automation?
│   └── Hook → use toolkit:claude-code-memory-and-hooks skill
├── Want persistent conventions?
│   ├── Shared with team → .claude/rules/ or CLAUDE.md
│   ├── Personal, all projects → ~/.claude/rules/ or ~/.claude/CLAUDE.md
│   ├── Personal, one project → CLAUDE.local.md
│   └── Use toolkit:claude-code-memory-and-hooks skill for setup
└── Recurring across sessions?
    └── Auto memory MEMORY.md
```

## Choosing the Right Scope

When an improvement could live in multiple places, consider who benefits:

| Scope | Best For | Trade-off |
|-------|----------|-----------|
| External skill/agent PR | Behavior everyone hits — the fix ships to all users | Requires upstream review, slower to land |
| Personal skill/agent | Your workflows that span all projects | Only benefits you, but no review needed |
| User settings (`~/.claude/settings.json`) | Permissions and preferences you always want | Applies everywhere — be sure it's universally wanted |
| User CLAUDE.md (`~/.claude/CLAUDE.md`) | Coding conventions you always follow | Every project sees these instructions |
| User rules (`~/.claude/rules/`) | Personal conventions scoped by topic or file type | All your projects — modular and path-scopable |
| Project shared (`.claude/settings.json`, `CLAUDE.md`) | Team conventions and project architecture | Committed to repo — team must agree |
| Project rules (`.claude/rules/`) | File-type-scoped team conventions | Committed to repo — team must agree |
| Project local (`.claude/settings.local.json`) | Personal overrides for one project | Narrowest reach — lowest risk, lowest reuse |
| Auto memory (`MEMORY.md`) | Learnings that persist across sessions | Ephemeral — first 200 lines only, one project |

Improvements to shared skills and agents have the highest potential reach since they benefit every user across every project. But the right scope depends on whether the fix is universally applicable or specific to the user's context.
