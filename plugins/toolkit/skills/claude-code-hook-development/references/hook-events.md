# Hook Events Reference

Complete reference for all Claude Code hook events.

## Common Input Fields

All hooks receive JSON via stdin with these common fields:

```json
{
  "session_id": "abc123",
  "transcript_path": "/path/to/session.jsonl",
  "cwd": "/current/working/directory",
  "permission_mode": "default",
  "hook_event_name": "PreToolUse"
}
```

Permission modes: `default`, `plan`, `acceptEdits`, `dontAsk`, `bypassPermissions`

---

## PreToolUse

Runs before tool executes. Can block, allow, or modify tool calls.

### Input

```json
{
  "hook_event_name": "PreToolUse",
  "tool_name": "Bash",
  "tool_input": {
    "command": "npm test"
  },
  "tool_use_id": "toolu_01ABC123"
}
```

### Output

**Exit codes (simple):**
- `exit 0` - Allow the tool call
- `exit 2` - Block with stderr message shown to Claude

**JSON output (advanced):** Output to stdout for finer control.

#### Allow (auto-approve)

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "permissionDecisionReason": "Auto-approved safe command"
  }
}
```

#### Ask (require user confirmation)

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "ask",
    "permissionDecisionReason": "Confirm before proceeding"
  }
}
```

#### Deny (block)

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Operation not permitted"
  }
}
```

#### Modify tool input

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "updatedInput": {
      "command": "npm test --coverage"
    }
  }
}
```

---

## PostToolUse

Runs after tool completes. Provide feedback or trigger actions.

### Input

```json
{
  "hook_event_name": "PostToolUse",
  "tool_name": "Edit",
  "tool_input": {
    "file_path": "/path/to/file.ts"
  },
  "tool_response": {
    "success": true
  },
  "tool_use_id": "toolu_01ABC123"
}
```

### Output (JSON)

```json
{
  "decision": "block",
  "reason": "Lint errors found. Please fix.",
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "Error on line 42: unused variable"
  }
}
```

---

## PermissionRequest

Runs when user sees a permission dialog. Can auto-allow or deny.

### Input

Same as PreToolUse.

### Output (JSON)

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PermissionRequest",
    "decision": {
      "behavior": "allow",
      "updatedInput": {
        "command": "npm run lint"
      }
    }
  }
}
```

For deny:
```json
{
  "hookSpecificOutput": {
    "hookEventName": "PermissionRequest",
    "decision": {
      "behavior": "deny",
      "message": "Operation not allowed",
      "interrupt": true
    }
  }
}
```

---

## UserPromptSubmit

Runs when user submits a prompt. Can block or add context.

### Input

```json
{
  "hook_event_name": "UserPromptSubmit",
  "prompt": "Fix the bug in auth.ts"
}
```

### Output

Plain text stdout is added as context. Or use JSON:

```json
{
  "decision": "block",
  "reason": "Prompt contains sensitive data",
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "Current branch: feature/auth"
  }
}
```

---

## Stop / SubagentStop

Runs when agent finishes. Can force continuation.

### Input

```json
{
  "hook_event_name": "Stop",
  "stop_hook_active": false
}
```

`stop_hook_active` is true if already continuing from a stop hook (prevents infinite loops).

### Output (JSON)

```json
{
  "decision": "block",
  "reason": "Tests not run yet. Please run npm test."
}
```

---

## SessionStart

Runs when session begins. Load context or set up environment.

### Input

```json
{
  "hook_event_name": "SessionStart",
  "source": "startup"
}
```

Sources: `startup`, `resume`, `clear`, `compact`

### Environment Variables

`CLAUDE_ENV_FILE` - Write exports here to persist env vars:

```bash
if [ -n "$CLAUDE_ENV_FILE" ]; then
  echo 'export NODE_ENV=development' >> "$CLAUDE_ENV_FILE"
fi
```

### Output (JSON)

```json
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "Project uses pnpm. Node version: 20.x"
  }
}
```

---

## SessionEnd

Runs when session ends. Cleanup only, cannot block.

### Input

```json
{
  "hook_event_name": "SessionEnd",
  "reason": "exit"
}
```

Reasons: `clear`, `logout`, `prompt_input_exit`, `other`

---

## Notification

Runs when notifications are sent.

### Input

```json
{
  "hook_event_name": "Notification",
  "message": "Claude needs your permission",
  "notification_type": "permission_prompt"
}
```

Types: `permission_prompt`, `idle_prompt`, `auth_success`, `elicitation_dialog`

---

## PreCompact

Runs before context compaction.

### Input

```json
{
  "hook_event_name": "PreCompact",
  "trigger": "manual",
  "custom_instructions": ""
}
```

Triggers: `manual`, `auto`

---

## Prompt-Based Hooks

Use LLM for context-aware decisions:

```json
{
  "type": "prompt",
  "prompt": "Evaluate if this is safe: $ARGUMENTS\n\nRespond with JSON: {\"decision\": \"approve\" or \"block\", \"reason\": \"...\"}",
  "timeout": 30
}
```

LLM must respond with:

```json
{
  "decision": "approve",
  "reason": "Explanation",
  "continue": false,
  "stopReason": "Custom stop message",
  "systemMessage": "Warning to user"
}
```
