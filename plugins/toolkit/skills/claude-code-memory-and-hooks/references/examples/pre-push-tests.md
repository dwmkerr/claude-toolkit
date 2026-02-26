# Example: Run Tests Before Git Push

Block `git push` unless all tests and linting pass.

Source: [Steve Kinney's Claude Code Hook Examples](https://stevekinney.com/courses/ai-development/claude-code-hook-examples)

## Settings

`.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/pre-bash-push-checks.sh"
          }
        ]
      }
    ]
  }
}
```

## Script

`.claude/hooks/pre-bash-push-checks.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

cmd=$(jq -r '.tool_input.command // ""')

# Only run checks for git push commands
if ! echo "$cmd" | grep -Eq '\bgit\s+push\b'; then
  exit 0
fi

errors=()

# Run linting
if [ -f package.json ]; then
  if command -v pnpm &> /dev/null && [ -f pnpm-lock.yaml ]; then
    if ! pnpm -s lint 2>/dev/null; then
      errors+=("Lint check failed")
    fi
  elif command -v npm &> /dev/null; then
    if ! npm run lint --silent 2>/dev/null; then
      errors+=("Lint check failed")
    fi
  fi
fi

# Run type checking
if [ -f tsconfig.json ]; then
  if ! npx tsc --noEmit 2>/dev/null; then
    errors+=("TypeScript type check failed")
  fi
fi

# Run tests
if [ -f package.json ]; then
  if command -v pnpm &> /dev/null && [ -f pnpm-lock.yaml ]; then
    if ! pnpm -s test 2>/dev/null; then
      errors+=("Tests failed")
    fi
  elif command -v npm &> /dev/null; then
    if ! npm test --silent 2>/dev/null; then
      errors+=("Tests failed")
    fi
  fi
fi

# Block if any errors
if [ ${#errors[@]} -gt 0 ]; then
  echo "Cannot push. Fix these issues first:" >&2
  printf '  - %s\n' "${errors[@]}" >&2
  exit 2
fi

exit 0
```

Make executable:

```bash
chmod +x .claude/hooks/pre-bash-push-checks.sh
```

---

# Example: Block PR Creation Without Tests

Block MCP GitHub PR creation tool unless tests pass.

## Settings

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "mcp__github__create_pull_request",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/pre-pr-requires-tests.sh"
          }
        ]
      }
    ]
  }
}
```

## Script

`.claude/hooks/pre-pr-requires-tests.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

if pnpm -s test -- --reporter=dot 2>/dev/null; then
  exit 0
else
  echo "Tests are failing. Fix tests before creating a PR." >&2
  exit 2
fi
```

---

# Example: Full CI Check Before Push

Run the complete CI pipeline locally before allowing push.

## Script

`.claude/hooks/pre-bash-ci-check.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

cmd=$(jq -r '.tool_input.command // ""')

# Only intercept git push
if ! echo "$cmd" | grep -Eq '\bgit\s+push\b'; then
  exit 0
fi

echo "Running CI checks before push..." >&2

# Build
if [ -f package.json ]; then
  echo "  Building..." >&2
  if ! pnpm build 2>/dev/null; then
    echo "Build failed. Fix build errors before pushing." >&2
    exit 2
  fi
fi

# Lint
echo "  Linting..." >&2
if ! pnpm lint 2>/dev/null; then
  echo "Lint failed. Fix lint errors before pushing." >&2
  exit 2
fi

# Type check
if [ -f tsconfig.json ]; then
  echo "  Type checking..." >&2
  if ! pnpm typecheck 2>/dev/null; then
    echo "Type check failed. Fix type errors before pushing." >&2
    exit 2
  fi
fi

# Tests
echo "  Running tests..." >&2
if ! pnpm test 2>/dev/null; then
  echo "Tests failed. Fix failing tests before pushing." >&2
  exit 2
fi

echo "All checks passed!" >&2
exit 0
```

---

# Example: Makefile-Based CI Check

If your project uses a Makefile for CI:

## Script

`.claude/hooks/pre-bash-make-ci.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

cmd=$(jq -r '.tool_input.command // ""')

# Only intercept git push
if ! echo "$cmd" | grep -Eq '\bgit\s+push\b'; then
  exit 0
fi

# Run make ci target
if [ -f Makefile ] && grep -q '^ci:' Makefile; then
  if ! make ci 2>&1; then
    echo "CI checks failed. Run 'make ci' to see errors." >&2
    exit 2
  fi
fi

exit 0
```

---

# Example: Require Confirmation Before Push

Run checks then require user confirmation via permission dialog. Uses JSON output with `permissionDecision: "ask"` (see [hook-events.md](../hook-events.md#permission-decisions)).

## Script

`.claude/hooks/pre-push-confirm.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

cmd=$(jq -r '.tool_input.command // ""')

# Only intercept git push
if ! echo "$cmd" | grep -Eq '\bgit\s+push\b'; then
  exit 0
fi

# Block pushes to main/master
if echo "$cmd" | grep -Eq '\bgit\s+push\s+(origin\s+)?(main|master)\b'; then
  echo "BLOCKED: Direct push to main/master not allowed." >&2
  exit 2
fi

# Run build
echo "Running build..." >&2
if ! npm run build >&2 2>&1; then
  echo "Build failed." >&2
  exit 2
fi

# Require user confirmation via permission dialog
cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "ask",
    "permissionDecisionReason": "Build passed. Confirm push."
  }
}
EOF
```

---

# Tips

1. **Test scripts manually first** - Run your script with sample JSON input
2. **Keep messages actionable** - Tell Claude exactly what to fix
3. **Use `--silent` or `-s` flags** - Reduce noise in output
4. **Exit early for non-matching commands** - Check command pattern first
5. **Consider timeout** - Long-running tests may need increased timeout:

```json
{
  "type": "command",
  "command": ".claude/hooks/pre-bash-push-checks.sh",
  "timeout": 300
}
```
