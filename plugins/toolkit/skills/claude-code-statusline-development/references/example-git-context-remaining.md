# Example: Git Branch with Context Remaining

Displays directory, git branch, and context remaining percentage with color-coded warnings.

## Features

- Truncated path (last 3 folders)
- Git branch in green
- Context remaining percentage with color coding:
  - Green (50-100%): plenty of context
  - Amber (20-50%): context getting low
  - Bold red (<20%): context critically low

## Script

`~/.claude/statusline.sh`:

```bash
#!/bin/bash

# Read JSON input from stdin
input=$(cat)

# Extract current directory using jq
CURRENT_DIR=$(echo "$input" | jq -r '.workspace.current_dir')

# Colors using ANSI codes directly
reset=$'\e[0m'
bold=$'\e[1m'
fg_blue=$'\e[34m'
fg_green=$'\e[32m'
fg_grey=$'\e[90m'
# Context colors (green/amber normal, red bold)
ctx_green=$'\e[92m'
ctx_yellow=$'\e[93m'
ctx_red=$'\e[1;91m'

# Get PWD limited to 3 folders
pwd_display=$(echo "${CURRENT_DIR/#$HOME/~}" | rev | cut -d'/' -f1-3 | rev)

# Get git info if in a git repo
git_info=""
if cd "$CURRENT_DIR" 2>/dev/null && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    branch=$(git branch --show-current 2>/dev/null)
    if [ -n "$branch" ]; then
        git_info=" ${fg_green}${branch}${reset}"
    fi
fi

# Calculate context remaining percentage
context_size=$(echo "$input" | jq -r '.context_window.context_window_size')
usage=$(echo "$input" | jq '.context_window.current_usage')

remaining=100
if [ "$usage" != "null" ] && [ "$context_size" != "null" ] && [ "$context_size" != "0" ]; then
    current_tokens=$(echo "$usage" | jq '.input_tokens + .cache_creation_input_tokens + .cache_read_input_tokens')
    used_percent=$((current_tokens * 100 / context_size))
    remaining=$((100 - used_percent))
fi

# Color based on remaining: 100-50% green, 50-20% amber, <20% bold red
if [ "$remaining" -ge 50 ]; then
    ctx_color="${ctx_green}"
elif [ "$remaining" -ge 20 ]; then
    ctx_color="${ctx_yellow}"
else
    ctx_color="${ctx_red}"
fi

# Output the status line
echo "${bold}${fg_blue}${pwd_display}${reset}${git_info} ${fg_grey}? for help |${reset} ${ctx_color}${remaining}%${reset}"
```

## Output

```
~/repos/my-project main ? for help | 72%
```

The percentage changes color as context is consumed:
- `72%` in green - plenty of room
- `35%` in amber - getting low
- `12%` in bold red - critically low

## Notes

- Uses ANSI escape codes directly for reliable color handling
- Grey separator keeps focus on the important elements
- Bold red at low context creates urgency without being distracting at higher levels
