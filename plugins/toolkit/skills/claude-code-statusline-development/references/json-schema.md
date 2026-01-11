# JSON Input Schema

Complete structure of JSON passed to statusline scripts via stdin.

## Full Structure

```json
{
  "hook_event_name": "Status",
  "session_id": "abc123...",
  "transcript_path": "/path/to/transcript.json",
  "cwd": "/current/working/directory",
  "model": {
    "id": "claude-opus-4-1",
    "display_name": "Opus"
  },
  "workspace": {
    "current_dir": "/current/working/directory",
    "project_dir": "/original/project/directory"
  },
  "version": "1.0.80",
  "output_style": {
    "name": "default"
  },
  "cost": {
    "total_cost_usd": 0.01234,
    "total_duration_ms": 45000,
    "total_api_duration_ms": 2300,
    "total_lines_added": 156,
    "total_lines_removed": 23
  },
  "context_window": {
    "total_input_tokens": 15234,
    "total_output_tokens": 4521,
    "context_window_size": 200000,
    "current_usage": {
      "input_tokens": 8500,
      "output_tokens": 1200,
      "cache_creation_input_tokens": 5000,
      "cache_read_input_tokens": 2000
    }
  }
}
```

## Field Reference

### Root Fields

| Field | Type | Description |
|-------|------|-------------|
| `hook_event_name` | string | Always "Status" for statusline |
| `session_id` | string | Unique session identifier |
| `transcript_path` | string | Path to conversation transcript |
| `cwd` | string | Current working directory |
| `version` | string | Claude Code version |

### Model Object

| Field | Type | Description |
|-------|------|-------------|
| `model.id` | string | Model identifier (e.g., "claude-opus-4-1") |
| `model.display_name` | string | Friendly name (e.g., "Opus") |

### Workspace Object

| Field | Type | Description |
|-------|------|-------------|
| `workspace.current_dir` | string | Current working directory |
| `workspace.project_dir` | string | Original project directory |

### Cost Object

| Field | Type | Description |
|-------|------|-------------|
| `cost.total_cost_usd` | number | Total session cost in USD |
| `cost.total_duration_ms` | number | Total session duration |
| `cost.total_api_duration_ms` | number | Time spent in API calls |
| `cost.total_lines_added` | number | Lines added this session |
| `cost.total_lines_removed` | number | Lines removed this session |

### Context Window Object

| Field | Type | Description |
|-------|------|-------------|
| `context_window.total_input_tokens` | number | Cumulative input tokens |
| `context_window.total_output_tokens` | number | Cumulative output tokens |
| `context_window.context_window_size` | number | Maximum context size |
| `context_window.current_usage` | object | Current context state (may be null) |

### Current Usage Object

Available in `context_window.current_usage` (null if no messages yet):

| Field | Type | Description |
|-------|------|-------------|
| `input_tokens` | number | Input tokens in current context |
| `output_tokens` | number | Output tokens generated |
| `cache_creation_input_tokens` | number | Tokens written to cache |
| `cache_read_input_tokens` | number | Tokens read from cache |

## Helper Functions (Bash)

```bash
#!/bin/bash
input=$(cat)

# Helper functions
get_model_name() { echo "$input" | jq -r '.model.display_name'; }
get_current_dir() { echo "$input" | jq -r '.workspace.current_dir'; }
get_project_dir() { echo "$input" | jq -r '.workspace.project_dir'; }
get_version() { echo "$input" | jq -r '.version'; }
get_cost() { echo "$input" | jq -r '.cost.total_cost_usd'; }
get_duration() { echo "$input" | jq -r '.cost.total_duration_ms'; }
get_lines_added() { echo "$input" | jq -r '.cost.total_lines_added'; }
get_lines_removed() { echo "$input" | jq -r '.cost.total_lines_removed'; }
get_input_tokens() { echo "$input" | jq -r '.context_window.total_input_tokens'; }
get_output_tokens() { echo "$input" | jq -r '.context_window.total_output_tokens'; }
get_context_window_size() { echo "$input" | jq -r '.context_window.context_window_size'; }
```
