# Example: Firewall - Block Dangerous Commands

Block dangerous bash commands like `rm -rf /`, `git reset --hard`, and network curls.

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
            "command": ".claude/hooks/pre-bash-firewall.sh"
          }
        ]
      }
    ]
  }
}
```

## Script

`.claude/hooks/pre-bash-firewall.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

cmd=$(jq -r '.tool_input.command // ""')

deny_patterns=(
  'rm\s+-rf\s+/'
  'git\s+reset\s+--hard'
  'curl\s+http'
  'wget\s+http'
  'git\s+push\s+.*--force'
  'dd\s+if='
  'mkfs\.'
  '>\s*/dev/'
)

for pat in "${deny_patterns[@]}"; do
  if echo "$cmd" | grep -Eiq "$pat"; then
    echo "Blocked: matches denied pattern '$pat'. Use a safer alternative." >&2
    exit 2
  fi
done

exit 0
```

Make executable:

```bash
chmod +x .claude/hooks/pre-bash-firewall.sh
```

---

# Example: Enforce Package Manager

Block `npm` in repos that use `pnpm`.

## Script

`.claude/hooks/pre-bash-enforce-pnpm.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail
cmd=$(jq -r '.tool_input.command // ""')

if [ -f pnpm-lock.yaml ] && echo "$cmd" | grep -Eq '\bnpm\b'; then
  echo "This repo uses pnpm. Replace 'npm' with 'pnpm'." >&2
  exit 2
fi

exit 0
```

Add to PreToolUse Bash hooks alongside firewall.

---

# Example: Protect Sensitive Files

Block edits to protected paths and binaries.

## Settings

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/pre-edit-protect-paths.sh"
          }
        ]
      }
    ]
  }
}
```

## Script

`.claude/hooks/pre-edit-protect-paths.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail
file=$(jq -r '.tool_input.file_path // .tool_input.path // ""')

deny_globs=(
  ".env*"
  ".git/*"
  "package-lock.json"
  "pnpm-lock.yaml"
  "node_modules/*"
  "*.png"
  "*.jpg"
  "*.gif"
  "*.mp4"
  "*.woff"
  "*.woff2"
)

for g in "${deny_globs[@]}"; do
  if printf '%s\n' "$file" | grep -Eiq "^${g//\*/.*}$"; then
    echo "Edits to '$file' are blocked by policy." >&2
    exit 2
  fi
done

exit 0
```

---

# Example: Audit Log

Log all bash commands for audit trail.

## Script

`.claude/hooks/pre-bash-log.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail
cmd=$(jq -r '.tool_input.command // ""')
printf '%s %s\n' "$(date -Is)" "$cmd" >> .claude/bash-commands.log
exit 0
```
