# Example: Cost Tracking Statusline

Display session costs, duration, and code changes.

## Basic Cost Display

`~/.claude/statusline.sh`:

```bash
#!/bin/bash
input=$(cat)

MODEL=$(echo "$input" | jq -r '.model.display_name')
COST=$(echo "$input" | jq -r '.cost.total_cost_usd')

# Format cost to 4 decimal places
COST_FMT=$(printf "%.4f" "$COST")

echo "[$MODEL] \$${COST_FMT}"
```

## Output

```
[Opus] $0.0123
```

## With Lines Changed

```bash
#!/bin/bash
input=$(cat)

MODEL=$(echo "$input" | jq -r '.model.display_name')
ADDED=$(echo "$input" | jq -r '.cost.total_lines_added')
REMOVED=$(echo "$input" | jq -r '.cost.total_lines_removed')

# Colors
green=$(tput setaf 2)
red=$(tput setaf 1)
reset=$(tput sgr0)

echo "[$MODEL] ${green}+${ADDED}${reset} ${red}-${REMOVED}${reset}"
```

## Output

```
[Opus] +156 -23
```

## Full Cost Dashboard

```bash
#!/bin/bash
input=$(cat)

MODEL=$(echo "$input" | jq -r '.model.display_name')
COST=$(echo "$input" | jq -r '.cost.total_cost_usd')
DURATION=$(echo "$input" | jq -r '.cost.total_duration_ms')
ADDED=$(echo "$input" | jq -r '.cost.total_lines_added')
REMOVED=$(echo "$input" | jq -r '.cost.total_lines_removed')

# Colors
green=$(tput setaf 2)
red=$(tput setaf 1)
dim=$(tput dim)
reset=$(tput sgr0)

# Format cost
COST_FMT=$(printf "%.3f" "$COST")

# Format duration as minutes:seconds
DURATION_SEC=$((DURATION / 1000))
MINS=$((DURATION_SEC / 60))
SECS=$((DURATION_SEC % 60))
TIME_FMT=$(printf "%d:%02d" "$MINS" "$SECS")

echo "[$MODEL] \$${COST_FMT} ${dim}${TIME_FMT}${reset} ${green}+${ADDED}${reset}/${red}-${REMOVED}${reset}"
```

## Output

```
[Opus] $0.012 3:45 +156/-23
```

## Cost Per Minute Rate

```bash
#!/bin/bash
input=$(cat)

MODEL=$(echo "$input" | jq -r '.model.display_name')
COST=$(echo "$input" | jq -r '.cost.total_cost_usd')
DURATION=$(echo "$input" | jq -r '.cost.total_duration_ms')

COST_FMT=$(printf "%.3f" "$COST")

# Calculate cost per minute
if [ "$DURATION" -gt 0 ]; then
    RATE=$(echo "scale=4; $COST / ($DURATION / 60000)" | bc)
    RATE_FMT=$(printf "%.3f" "$RATE")
    echo "[$MODEL] \$${COST_FMT} (\$${RATE_FMT}/min)"
else
    echo "[$MODEL] \$${COST_FMT}"
fi
```

## Output

```
[Opus] $0.012 ($0.003/min)
```

## Combined: Cost + Context

```bash
#!/bin/bash
input=$(cat)

MODEL=$(echo "$input" | jq -r '.model.display_name')
COST=$(echo "$input" | jq -r '.cost.total_cost_usd')
CONTEXT_SIZE=$(echo "$input" | jq -r '.context_window.context_window_size')
USAGE=$(echo "$input" | jq '.context_window.current_usage')

# Colors
green=$(tput setaf 2)
yellow=$(tput setaf 3)
red=$(tput setaf 1)
dim=$(tput dim)
reset=$(tput sgr0)

COST_FMT=$(printf "%.3f" "$COST")

PERCENT=0
if [ "$USAGE" != "null" ]; then
    CURRENT=$(echo "$USAGE" | jq '.input_tokens + .cache_creation_input_tokens + .cache_read_input_tokens')
    PERCENT=$((CURRENT * 100 / CONTEXT_SIZE))
fi

# Color context based on usage
if [ "$PERCENT" -lt 50 ]; then
    CTX_COLOR=$green
elif [ "$PERCENT" -lt 80 ]; then
    CTX_COLOR=$yellow
else
    CTX_COLOR=$red
fi

echo "[$MODEL] \$${COST_FMT} ${dim}|${reset} ${CTX_COLOR}${PERCENT}%${reset}"
```

## Output

```
[Opus] $0.012 | 42%
```

## Python Version

```python
#!/usr/bin/env python3
import json
import sys

data = json.load(sys.stdin)

model = data['model']['display_name']
cost = data['cost']['total_cost_usd']
added = data['cost']['total_lines_added']
removed = data['cost']['total_lines_removed']

# ANSI colors
GREEN = '\033[32m'
RED = '\033[31m'
RESET = '\033[0m'

print(f"[{model}] ${cost:.3f} {GREEN}+{added}{RESET} {RED}-{removed}{RESET}")
```
