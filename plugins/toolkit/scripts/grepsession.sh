#!/usr/bin/env bash
#
# grepsession - grep the current Claude Code session log
#
# Usage:
#   grepsession PATTERN [grep-options]
#
# Examples:
#   grepsession '"name":"Skill"'        # find skill invocations
#   grepsession '"name":"Task"'         # find agent invocations
#   grepsession '"name":"Skill"' -C 3   # with 3 lines context
#   grepsession 'error' -i              # case-insensitive search
#
# If no session found, exits with error.

set -euo pipefail

# Show usage by extracting lines 2 to first blank line from this file
if [[ $# -lt 1 ]]; then
    sed -n '2,/^$/p' "$0" | sed 's/^# \?//'
    exit 1
fi

PATTERN="$1"
shift

# Claude stores sessions at ~/.claude/projects/-<path>
# Path is derived from cwd with / and _ replaced by -
# e.g. /Users/dave/my_project -> -Users-dave-my-project
PROJECT_PATH=$(pwd | sed 's/[/_]/-/g' | sed 's/^-//')
SESSION_DIR="$HOME/.claude/projects/-${PROJECT_PATH}"

if [[ ! -d "$SESSION_DIR" ]]; then
    echo "No session directory found: $SESSION_DIR" >&2
    exit 1
fi

# Get most recent session file (ls -t sorts by modification time)
SESSION_FILE=$(ls -t "$SESSION_DIR"/*.jsonl 2>/dev/null | head -1)

if [[ -z "$SESSION_FILE" || ! -f "$SESSION_FILE" ]]; then
    echo "No session file found in: $SESSION_DIR" >&2
    exit 1
fi

# Pass through grep options (-A, -B, -C, -i, etc.) after the pattern
# Use || true because grep exits 1 when no matches found (not an error)
grep -n "$PATTERN" "$SESSION_FILE" "$@" || true
