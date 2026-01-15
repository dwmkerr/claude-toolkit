# Plugin Components Reference

Detailed specifications for all plugin component types.

**Official docs:** https://code.claude.com/docs/en/plugins-reference

## Commands

Custom slash commands that integrate with Claude Code's command system.

**Location:** `commands/` directory
**Format:** Markdown files with frontmatter

```markdown
---
description: What this command does
allowed-tools: Bash(git:*), Read
argument-hint: [filename]
---

Your prompt instructions here.
```

## Agents

Specialized subagents Claude invokes automatically based on task context.

**Location:** `agents/` directory
**Format:** Markdown files with frontmatter

```yaml
---
description: What this agent specializes in
capabilities: ["task1", "task2", "task3"]
---

# Agent Name

Detailed description of the agent's role and when Claude should invoke it.

## Capabilities
- Specific task the agent excels at
- When to use this agent vs others

## Context and examples
Examples of when this agent should be used.
```

**Integration:**
- Agents appear in `/agents` interface
- Claude invokes automatically based on context
- Users can invoke manually

## Skills

Extend Claude's capabilities. Claude autonomously decides when to use them.

**Location:** `skills/` directory (subdirectories with SKILL.md)
**Format:** Directories containing SKILL.md files

```
skills/
├── pdf-processor/
│   ├── SKILL.md
│   ├── reference.md (optional)
│   └── scripts/ (optional)
└── code-reviewer/
    └── SKILL.md
```

**Integration:**
- Automatically discovered on install
- Claude invokes based on matching task context
- Can include supporting files

## Hooks

Event handlers that respond to Claude Code events.

**Location:** `hooks/hooks.json` or inline in `plugin.json`
**Format:** JSON configuration

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/format-code.sh"
          }
        ]
      }
    ]
  }
}
```

### Available Events

| Event | When | Can Block? |
|-------|------|------------|
| PreToolUse | Before tool executes | Yes |
| PostToolUse | After tool succeeds | No |
| PostToolUseFailure | After tool fails | No |
| PermissionRequest | Permission dialog shown | Yes |
| UserPromptSubmit | User submits prompt | Yes |
| Notification | Notification sent | No |
| Stop | Main agent finishes | Yes |
| SubagentStart | Subagent starts | No |
| SubagentStop | Subagent finishes | Yes |
| SessionStart | Session begins | No |
| SessionEnd | Session ends | No |
| PreCompact | Before history compact | No |

### Hook Types

| Type | Description |
|------|-------------|
| command | Execute shell commands or scripts |
| prompt | Evaluate prompt with LLM (uses `$ARGUMENTS`) |
| agent | Run agentic verifier with tools |

## MCP Servers

Bundle Model Context Protocol servers for external tool integration.

**Location:** `.mcp.json` or inline in `plugin.json`
**Format:** Standard MCP configuration

```json
{
  "mcpServers": {
    "plugin-database": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
      "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
      "env": {
        "DB_PATH": "${CLAUDE_PLUGIN_ROOT}/data"
      }
    },
    "plugin-api-client": {
      "command": "npx",
      "args": ["@company/mcp-server", "--plugin-mode"],
      "cwd": "${CLAUDE_PLUGIN_ROOT}"
    }
  }
}
```

**Integration:**
- Start automatically when plugin enabled
- Appear as standard MCP tools
- Configured independently of user MCP servers

## LSP Servers

Language Server Protocol servers for real-time code intelligence.

**Location:** `.lsp.json` or inline in `plugin.json`
**Format:** JSON configuration

```json
{
  "go": {
    "command": "gopls",
    "args": ["serve"],
    "extensionToLanguage": {
      ".go": "go"
    }
  }
}
```

### Required Fields

| Field | Description |
|-------|-------------|
| command | LSP binary to execute (must be in PATH) |
| extensionToLanguage | Maps file extensions to language IDs |

### Optional Fields

| Field | Description |
|-------|-------------|
| args | Command-line arguments |
| transport | `stdio` (default) or `socket` |
| env | Environment variables |
| initializationOptions | Options for server init |
| settings | Workspace settings |
| workspaceFolder | Workspace folder path |
| startupTimeout | Max startup wait (ms) |
| shutdownTimeout | Max shutdown wait (ms) |
| restartOnCrash | Auto-restart on crash |
| maxRestarts | Max restart attempts |

**Note:** You must install the language server binary separately. LSP plugins configure connections, not the servers themselves.

### Available LSP Plugins

| Plugin | Server | Install |
|--------|--------|---------|
| pyright-lsp | Pyright | `pip install pyright` |
| typescript-lsp | TypeScript LS | `npm install -g typescript-language-server typescript` |
| rust-lsp | rust-analyzer | See rust-analyzer docs |
