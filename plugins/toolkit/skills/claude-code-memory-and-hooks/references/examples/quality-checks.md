# Example: Auto-Format and Lint After Edits

Run formatting, linting, and type checking after file edits.

Source: [Steve Kinney's Claude Code Hook Examples](https://stevekinney.com/courses/ai-development/claude-code-hook-examples)

## Settings

`.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/post-edit-quality.sh"
          }
        ]
      }
    ]
  }
}
```

## Script

`.claude/hooks/post-edit-quality.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

msg() {
  echo "$*"
}

if [ -f package.json ]; then
  # Format (non-blocking)
  npx prettier -w . 2>/dev/null || true

  # Lint
  if ! pnpm -s lint 2>/dev/null; then
    msg "Lint failed. Please fix lint errors."
  fi

  # Typecheck
  if ! pnpm -s typecheck 2>/dev/null; then
    msg "Typecheck failed. Please resolve TS errors."
  fi
fi

exit 0
```

Note: PostToolUse hooks can't block (tool already ran), but output is shown to Claude.

---

# Example: Format Specific File Types

Only format the edited file, not the whole project.

## Script

`.claude/hooks/post-edit-format-file.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

file=$(jq -r '.tool_input.file_path // .tool_input.path // ""')

# Skip if not a formattable file
case "$file" in
  *.ts|*.tsx|*.js|*.jsx|*.json|*.md|*.css|*.scss)
    ;;
  *)
    exit 0
    ;;
esac

# Format just the edited file
if command -v prettier &> /dev/null; then
  prettier --write "$file" 2>/dev/null || true
fi

exit 0
```

---

# Example: Auto-Commit After Edits

Create small commits to track agent work.

## Script

`.claude/hooks/post-edit-commit.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

git add -A
if ! git diff --cached --quiet; then
  git commit -m "chore(ai): apply Claude edit"
fi

exit 0
```

Add after quality checks in PostToolUse Edit list.

---

# Example: Run Tests After Edit

Run tests related to the edited file.

## Script

`.claude/hooks/post-edit-test.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

file=$(jq -r '.tool_input.file_path // .tool_input.path // ""')

# Skip non-source files
case "$file" in
  *.ts|*.tsx|*.js|*.jsx)
    ;;
  *)
    exit 0
    ;;
esac

# Find and run related test file
test_file="${file%.ts}.test.ts"
test_file="${test_file%.tsx}.test.tsx"

if [ -f "$test_file" ]; then
  if ! pnpm test -- "$test_file" --passWithNoTests 2>/dev/null; then
    echo "Tests failed for $test_file"
  fi
fi

exit 0
```

---

# Example: Comprehensive Quality Pipeline

Combine all checks in one script.

## Script

`.claude/hooks/post-edit-pipeline.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

file=$(jq -r '.tool_input.file_path // .tool_input.path // ""')
errors=()

# Skip non-source files
case "$file" in
  *.ts|*.tsx|*.js|*.jsx)
    ;;
  *)
    exit 0
    ;;
esac

# 1. Format
prettier --write "$file" 2>/dev/null || true

# 2. Lint
if ! eslint "$file" --fix 2>/dev/null; then
  errors+=("Lint errors in $file")
fi

# 3. Typecheck
if ! tsc --noEmit 2>/dev/null; then
  errors+=("Type errors found")
fi

# 4. Related tests
test_file="${file%.ts}.test.ts"
if [ -f "$test_file" ]; then
  if ! pnpm test -- "$test_file" --passWithNoTests 2>/dev/null; then
    errors+=("Tests failed: $test_file")
  fi
fi

# Report errors to Claude
if [ ${#errors[@]} -gt 0 ]; then
  printf '%s\n' "${errors[@]}"
fi

exit 0
```
