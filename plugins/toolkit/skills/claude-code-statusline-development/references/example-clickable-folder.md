# Example: Clickable Folder Link

Displays directory as a clickable link that opens in Finder (macOS).

## Features

- Truncated path (last 3 folders) as clickable link
- Opens folder in Finder when clicked
- Git branch in green
- Context remaining percentage with color coding

## Limitations

- **tmux**: Clickable links don't work inside tmux due to [claude-code#23438](https://github.com/anthropics/claude-code/issues/23438)
- Works in terminals that support OSC 8 hyperlinks (iTerm2, Ghostty, etc.)

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
ctx_green=$'\e[92m'
ctx_yellow=$'\e[93m'
ctx_red=$'\e[1;91m'

# OSC 8 hyperlink codes
osc8_start=$'\e]8;;'
osc8_end=$'\e\\'

# Get PWD limited to 3 folders for display
pwd_display=$(echo "${CURRENT_DIR/#$HOME/~}" | rev | cut -d'/' -f1-3 | rev)

# Create clickable folder link (file:// URL opens in Finder on macOS)
folder_url="file://${CURRENT_DIR}"
pwd_link="${osc8_start}${folder_url}${osc8_end}${bold}${fg_blue}${pwd_display}${reset}${osc8_start}${osc8_end}"

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
echo "${pwd_link}${git_info} ${fg_grey}? for help |${reset} ${ctx_color}${remaining}%${reset}"
```

## Output

```
~/repos/my-project main ? for help | 72%
```

The directory path is clickable - clicking opens Finder to that folder.

## How OSC 8 Works

```
\e]8;;URL\e\\DISPLAY_TEXT\e]8;;\e\\
│       │   │            │
│       │   │            └── Close hyperlink
│       │   └── Visible text
│       └── The URL (file://, https://, etc.)
└── Start hyperlink
```
