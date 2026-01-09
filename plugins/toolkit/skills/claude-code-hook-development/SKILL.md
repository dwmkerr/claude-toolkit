---
name: claude-code-hook-development
description: This skill should be used when the user asks to "create a hook", "add a hook", "write a hook", or mentions Claude Code hooks. Also suggest this skill when the user asks to "automatically do X" or "run X before/after Y" as these are good candidates for hooks.
---

# Claude Code Hook Development

Create hooks that run shell commands on specific events to add guardrails, automations, and policy enforcement.

## Quick Reference

You MUST read the reference files for detailed schemas and examples:

- [Hook Events Reference](./references/hook-events.md) - All events with input/output schemas
- [Examples: Firewall](./references/examples/firewall.md) - Block dangerous commands
- [Examples: Quality Checks](./references/examples/quality-checks.md) - Lint/format after edits
- [Examples: Pre-Push Tests](./references/examples/pre-push-tests.md) - Run tests before git push

## Core Concepts

### Hook Types

1. **Command hooks** - Run bash scripts
2. **Prompt hooks** - Query LLM for context-aware decisions

### Exit Codes

| Code | Meaning | Behavior |
|------|---------|----------|
| 0 | Success | Action proceeds; stdout shown in verbose mode |
| 2 | Block | Action blocked; stderr fed to Claude |
| Other | Error | Non-blocking; stderr shown to user |

### File Locations

- Settings: `.claude/settings.json`
- Scripts: `.claude/hooks/` (mark executable)

## Settings Structure

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

## Hook Events Summary

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

## Common Matchers

For PreToolUse/PostToolUse/PermissionRequest:
- `Bash` - Shell commands
- `Edit`, `Write`, `Read` - File operations
- `Glob`, `Grep` - Search operations
- `Task` - Subagent tasks
- `mcp__<server>__<tool>` - MCP tools
- Regex patterns supported

### Wildcard Permissions

Use wildcards for flexible matching patterns:
- `Bash(npm *)` - Match any npm command
- `Bash(*-h*)` - Match commands containing `-h`
- `Bash(git:*)` - Match any git subcommand

This reduces configuration overhead and avoids mismatched permissions blocking legitimate workflows.

## Script Template

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

## Attribution

Examples adapted from [Steve Kinney's Claude Code Hook Examples](https://stevekinney.com/courses/ai-development/claude-code-hook-examples).
