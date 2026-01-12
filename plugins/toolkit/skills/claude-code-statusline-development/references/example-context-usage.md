# Example: Context Usage Statusline

Display the percentage of context window consumed.

## Understanding Context Fields

The `context_window` object contains:

- `total_input_tokens` / `total_output_tokens`: Cumulative totals across the session
- `current_usage`: Current context window state (may be null if no messages yet)
  - `input_tokens`: Input tokens in current context
  - `cache_creation_input_tokens`: Tokens written to cache
  - `cache_read_input_tokens`: Tokens read from cache

For accurate context percentage, use `current_usage`.

## Basic Context Percentage

`~/.claude/statusline.sh`:

```bash
#!/bin/bash
input=$(cat)

model=$(echo "$input" | jq -r '.model.display_name')
context_size=$(echo "$input" | jq -r '.context_window.context_window_size')
usage=$(echo "$input" | jq '.context_window.current_usage')

if [ "$usage" != "null" ]; then
    current_tokens=$(echo "$usage" | jq '.input_tokens + .cache_creation_input_tokens + .cache_read_input_tokens')
    percent=$((current_tokens * 100 / context_size))
    echo "[$model] Context: ${percent}%"
else
    echo "[$model] Context: 0%"
fi
```

## Output

```
[Opus] Context: 42%
```

## With Color Coding

Changes color based on usage level:

```bash
#!/bin/bash
input=$(cat)

model=$(echo "$input" | jq -r '.model.display_name')
context_size=$(echo "$input" | jq -r '.context_window.context_window_size')
usage=$(echo "$input" | jq '.context_window.current_usage')

# Colors
green=$(tput setaf 2)
yellow=$(tput setaf 3)
red=$(tput setaf 1)
reset=$(tput sgr0)

if [ "$usage" != "null" ]; then
    current_tokens=$(echo "$usage" | jq '.input_tokens + .cache_creation_input_tokens + .cache_read_input_tokens')
    percent=$((current_tokens * 100 / context_size))

    # Color based on usage
    if [ "$percent" -lt 50 ]; then
        color=$green
    elif [ "$percent" -lt 80 ]; then
        color=$yellow
    else
        color=$red
    fi

    echo "[$model] ${color}${percent}%${reset}"
else
    echo "[$model] ${green}0%${reset}"
fi
```

## With Progress Bar

```bash
#!/bin/bash
input=$(cat)

model=$(echo "$input" | jq -r '.model.display_name')
context_size=$(echo "$input" | jq -r '.context_window.context_window_size')
usage=$(echo "$input" | jq '.context_window.current_usage')

# Colors
green=$(tput setaf 2)
yellow=$(tput setaf 3)
red=$(tput setaf 1)
dim=$(tput dim)
reset=$(tput sgr0)

percent=0
if [ "$usage" != "null" ]; then
    current_tokens=$(echo "$usage" | jq '.input_tokens + .cache_creation_input_tokens + .cache_read_input_tokens')
    percent=$((current_tokens * 100 / context_size))
fi

# Build progress bar (10 chars wide)
bar_width=10
filled=$((percent * bar_width / 100))
empty=$((bar_width - filled))

# Color based on usage
if [ "$percent" -lt 50 ]; then
    color=$green
elif [ "$percent" -lt 80 ]; then
    color=$yellow
else
    color=$red
fi

bar="${color}$(printf '█%.0s' $(seq 1 $filled 2>/dev/null))${dim}$(printf '░%.0s' $(seq 1 $empty 2>/dev/null))${reset}"

echo "[$model] $bar ${percent}%"
```

## Output

```
[Opus] ████░░░░░░ 42%
```

## With Token Counts

```bash
#!/bin/bash
input=$(cat)

model=$(echo "$input" | jq -r '.model.display_name')
context_size=$(echo "$input" | jq -r '.context_window.context_window_size')
usage=$(echo "$input" | jq '.context_window.current_usage')

if [ "$usage" != "null" ]; then
    current=$(echo "$usage" | jq '.input_tokens + .cache_creation_input_tokens + .cache_read_input_tokens')
    # Format as K (thousands)
    current_k=$((current / 1000))
    size_k=$((context_size / 1000))
    echo "[$model] ${current_k}K/${size_k}K tokens"
else
    size_k=$((context_size / 1000))
    echo "[$model] 0/${size_k}K tokens"
fi
```

## Output

```
[Opus] 45K/200K tokens
```
