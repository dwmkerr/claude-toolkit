# Example: Git-Aware Statusline

Displays current directory and git branch when inside a repository.

## Basic Git Branch

`~/.claude/statusline.sh`:

```bash
#!/bin/bash
input=$(cat)

MODEL=$(echo "$input" | jq -r '.model.display_name')
CURRENT_DIR=$(echo "$input" | jq -r '.workspace.current_dir')

# Get git branch if in a repo
GIT_BRANCH=""
if cd "$CURRENT_DIR" 2>/dev/null && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    BRANCH=$(git branch --show-current 2>/dev/null)
    if [ -n "$BRANCH" ]; then
        GIT_BRANCH=" | $BRANCH"
    fi
fi

echo "[$MODEL] ${CURRENT_DIR##*/}$GIT_BRANCH"
```

## Output

```
[Opus] my-project | main
```

## With Colors and Truncated Path

Based on dwmkerr's dotfiles statusline:

```bash
#!/bin/bash
input=$(cat)

CURRENT_DIR=$(echo "$input" | jq -r '.workspace.current_dir')

# Colors
blue=$(tput setaf 4)
green=$(tput setaf 2)
bold=$(tput bold)
dim=$(tput dim)
reset=$(tput sgr0)

# Truncate path to last 3 folders, replace $HOME with ~
pwd_display=$(echo "${CURRENT_DIR/#$HOME/~}" | rev | cut -d'/' -f1-3 | rev)

# Get git branch
git_info=""
if cd "$CURRENT_DIR" 2>/dev/null && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    branch=$(git branch --show-current 2>/dev/null)
    if [ -n "$branch" ]; then
        git_info=" ${green}${branch}${reset}"
    fi
fi

echo "${bold}${blue}${pwd_display}${reset}${git_info} ${dim}? for help${reset}"
```

## Output

```
~/repos/my-project main ? for help
```

## With Dirty State Indicator

```bash
#!/bin/bash
input=$(cat)

CURRENT_DIR=$(echo "$input" | jq -r '.workspace.current_dir')

# Colors
green=$(tput setaf 2)
yellow=$(tput setaf 3)
reset=$(tput sgr0)

git_info=""
if cd "$CURRENT_DIR" 2>/dev/null && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    branch=$(git branch --show-current 2>/dev/null)
    if [ -n "$branch" ]; then
        # Check for uncommitted changes
        if git diff --quiet 2>/dev/null && git diff --cached --quiet 2>/dev/null; then
            git_info=" ${green}${branch}${reset}"
        else
            git_info=" ${yellow}${branch}*${reset}"
        fi
    fi
fi

echo "${CURRENT_DIR##*/}${git_info}"
```

## Output

```
my-project main*
```

(asterisk indicates uncommitted changes)

## Python Version

```python
#!/usr/bin/env python3
import json
import sys
import os
import subprocess

data = json.load(sys.stdin)
current_dir = data['workspace']['current_dir']
dir_name = os.path.basename(current_dir)

# Check for git branch
git_branch = ""
try:
    os.chdir(current_dir)
    result = subprocess.run(
        ['git', 'branch', '--show-current'],
        capture_output=True, text=True
    )
    if result.returncode == 0 and result.stdout.strip():
        git_branch = f" | {result.stdout.strip()}"
except:
    pass

print(f"{dir_name}{git_branch}")
```
