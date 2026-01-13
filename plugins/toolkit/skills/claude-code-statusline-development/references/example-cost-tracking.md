# Example: Cost Tracking Statusline

Display session costs, duration, and code changes.

## Basic Cost Display

`~/.claude/statusline.sh`:

```bash
#!/bin/bash
input=$(cat)

model=$(echo "$input" | jq -r '.model.display_name')
cost=$(echo "$input" | jq -r '.cost.total_cost_usd')

# Format cost to 4 decimal places
cost_fmt=$(printf "%.4f" "$cost")

echo "[$model] \$${cost_fmt}"
```

## Output

```
[Opus] $0.0123
```

## With Lines Changed

```bash
#!/bin/bash
input=$(cat)

model=$(echo "$input" | jq -r '.model.display_name')
added=$(echo "$input" | jq -r '.cost.total_lines_added')
removed=$(echo "$input" | jq -r '.cost.total_lines_removed')

# Colors
green=$(tput setaf 2)
red=$(tput setaf 1)
reset=$(tput sgr0)

echo "[$model] ${green}+${added}${reset} ${red}-${removed}${reset}"
```

## Output

```
[Opus] +156 -23
```

## Full Cost Dashboard

```bash
#!/bin/bash
input=$(cat)

model=$(echo "$input" | jq -r '.model.display_name')
cost=$(echo "$input" | jq -r '.cost.total_cost_usd')
duration=$(echo "$input" | jq -r '.cost.total_duration_ms')
added=$(echo "$input" | jq -r '.cost.total_lines_added')
removed=$(echo "$input" | jq -r '.cost.total_lines_removed')

# Colors
green=$(tput setaf 2)
red=$(tput setaf 1)
dim=$(tput dim)
reset=$(tput sgr0)

# Format cost
cost_fmt=$(printf "%.3f" "$cost")

# Format duration as minutes:seconds
duration_sec=$((duration / 1000))
mins=$((duration_sec / 60))
secs=$((duration_sec % 60))
time_fmt=$(printf "%d:%02d" "$mins" "$secs")

echo "[$model] \$${cost_fmt} ${dim}${time_fmt}${reset} ${green}+${added}${reset}/${red}-${removed}${reset}"
```

## Output

```
[Opus] $0.012 3:45 +156/-23
```

## Cost Per Minute Rate

```bash
#!/bin/bash
input=$(cat)

model=$(echo "$input" | jq -r '.model.display_name')
cost=$(echo "$input" | jq -r '.cost.total_cost_usd')
duration=$(echo "$input" | jq -r '.cost.total_duration_ms')

cost_fmt=$(printf "%.3f" "$cost")

# Calculate cost per minute
if [ "$duration" -gt 0 ]; then
    rate=$(echo "scale=4; $cost / ($duration / 60000)" | bc)
    rate_fmt=$(printf "%.3f" "$rate")
    echo "[$model] \$${cost_fmt} (\$${rate_fmt}/min)"
else
    echo "[$model] \$${cost_fmt}"
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

model=$(echo "$input" | jq -r '.model.display_name')
cost=$(echo "$input" | jq -r '.cost.total_cost_usd')
context_size=$(echo "$input" | jq -r '.context_window.context_window_size')
usage=$(echo "$input" | jq '.context_window.current_usage')

# Colors
green=$(tput setaf 2)
yellow=$(tput setaf 3)
red=$(tput setaf 1)
dim=$(tput dim)
reset=$(tput sgr0)

cost_fmt=$(printf "%.3f" "$cost")

percent=0
if [ "$usage" != "null" ]; then
    current=$(echo "$usage" | jq '.input_tokens + .cache_creation_input_tokens + .cache_read_input_tokens')
    percent=$((current * 100 / context_size))
fi

# Color context based on usage
if [ "$percent" -lt 50 ]; then
    ctx_color=$green
elif [ "$percent" -lt 80 ]; then
    ctx_color=$yellow
else
    ctx_color=$red
fi

echo "[$model] \$${cost_fmt} ${dim}|${reset} ${ctx_color}${percent}%${reset}"
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
