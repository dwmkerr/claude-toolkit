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

MODEL=$(echo "$input" | jq -r '.model.display_name')
CONTEXT_SIZE=$(echo "$input" | jq -r '.context_window.context_window_size')
USAGE=$(echo "$input" | jq '.context_window.current_usage')

if [ "$USAGE" != "null" ]; then
    CURRENT_TOKENS=$(echo "$USAGE" | jq '.input_tokens + .cache_creation_input_tokens + .cache_read_input_tokens')
    PERCENT=$((CURRENT_TOKENS * 100 / CONTEXT_SIZE))
    echo "[$MODEL] Context: ${PERCENT}%"
else
    echo "[$MODEL] Context: 0%"
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

MODEL=$(echo "$input" | jq -r '.model.display_name')
CONTEXT_SIZE=$(echo "$input" | jq -r '.context_window.context_window_size')
USAGE=$(echo "$input" | jq '.context_window.current_usage')

# Colors
green=$(tput setaf 2)
yellow=$(tput setaf 3)
red=$(tput setaf 1)
reset=$(tput sgr0)

if [ "$USAGE" != "null" ]; then
    CURRENT_TOKENS=$(echo "$USAGE" | jq '.input_tokens + .cache_creation_input_tokens + .cache_read_input_tokens')
    PERCENT=$((CURRENT_TOKENS * 100 / CONTEXT_SIZE))

    # Color based on usage
    if [ "$PERCENT" -lt 50 ]; then
        COLOR=$green
    elif [ "$PERCENT" -lt 80 ]; then
        COLOR=$yellow
    else
        COLOR=$red
    fi

    echo "[$MODEL] ${COLOR}${PERCENT}%${reset}"
else
    echo "[$MODEL] ${green}0%${reset}"
fi
```

## With Progress Bar

```bash
#!/bin/bash
input=$(cat)

MODEL=$(echo "$input" | jq -r '.model.display_name')
CONTEXT_SIZE=$(echo "$input" | jq -r '.context_window.context_window_size')
USAGE=$(echo "$input" | jq '.context_window.current_usage')

# Colors
green=$(tput setaf 2)
yellow=$(tput setaf 3)
red=$(tput setaf 1)
dim=$(tput dim)
reset=$(tput sgr0)

PERCENT=0
if [ "$USAGE" != "null" ]; then
    CURRENT_TOKENS=$(echo "$USAGE" | jq '.input_tokens + .cache_creation_input_tokens + .cache_read_input_tokens')
    PERCENT=$((CURRENT_TOKENS * 100 / CONTEXT_SIZE))
fi

# Build progress bar (10 chars wide)
BAR_WIDTH=10
FILLED=$((PERCENT * BAR_WIDTH / 100))
EMPTY=$((BAR_WIDTH - FILLED))

# Color based on usage
if [ "$PERCENT" -lt 50 ]; then
    COLOR=$green
elif [ "$PERCENT" -lt 80 ]; then
    COLOR=$yellow
else
    COLOR=$red
fi

BAR="${COLOR}$(printf '█%.0s' $(seq 1 $FILLED 2>/dev/null))${dim}$(printf '░%.0s' $(seq 1 $EMPTY 2>/dev/null))${reset}"

echo "[$MODEL] $BAR ${PERCENT}%"
```

## Output

```
[Opus] ████░░░░░░ 42%
```

## With Token Counts

```bash
#!/bin/bash
input=$(cat)

MODEL=$(echo "$input" | jq -r '.model.display_name')
CONTEXT_SIZE=$(echo "$input" | jq -r '.context_window.context_window_size')
USAGE=$(echo "$input" | jq '.context_window.current_usage')

if [ "$USAGE" != "null" ]; then
    CURRENT=$(echo "$USAGE" | jq '.input_tokens + .cache_creation_input_tokens + .cache_read_input_tokens')
    # Format as K (thousands)
    CURRENT_K=$((CURRENT / 1000))
    SIZE_K=$((CONTEXT_SIZE / 1000))
    echo "[$MODEL] ${CURRENT_K}K/${SIZE_K}K tokens"
else
    SIZE_K=$((CONTEXT_SIZE / 1000))
    echo "[$MODEL] 0/${SIZE_K}K tokens"
fi
```

## Output

```
[Opus] 45K/200K tokens
```
