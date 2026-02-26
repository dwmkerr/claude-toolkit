# Memory Types

Detailed reference for all Claude Code memory locations and their behavior.

## CLAUDE.md Files

### Organization-level (Managed Policy)

| | |
|---|---|
| **Location** | macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md` |
| | Linux: `/etc/claude-code/CLAUDE.md` |
| | Windows: `C:\Program Files\ClaudeCode\CLAUDE.md` |
| **Purpose** | Organization-wide instructions managed by IT/DevOps |
| **Examples** | Company coding standards, security policies, compliance requirements |
| **Shared with** | All users in the organization |
| **Deployment** | Via configuration management (MDM, Group Policy, Ansible, etc.) |

### User-level

| | |
|---|---|
| **Location** | `~/.claude/CLAUDE.md` |
| **Purpose** | Personal preferences for all projects |
| **Examples** | Code styling preferences, personal tooling shortcuts, commit conventions |
| **Shared with** | Just you (all projects) |

### User-level Rules

| | |
|---|---|
| **Location** | `~/.claude/rules/*.md` |
| **Purpose** | Personal modular instructions for all projects |
| **Priority** | Loaded before project rules (project rules take precedence) |

### Project-level (Shared)

| | |
|---|---|
| **Location** | `./CLAUDE.md` or `./.claude/CLAUDE.md` |
| **Purpose** | Team-shared instructions for the project |
| **Examples** | Project architecture, coding standards, common workflows |
| **Shared with** | Team members via source control |

### Project Rules

| | |
|---|---|
| **Location** | `./.claude/rules/*.md` |
| **Purpose** | Modular, topic-specific project instructions |
| **Examples** | Language-specific guidelines, testing conventions, API standards |
| **Shared with** | Team members via source control |
| **Features** | Path scoping, subdirectories, symlinks |

### Project-level (Local)

| | |
|---|---|
| **Location** | `./CLAUDE.local.md` |
| **Purpose** | Personal project-specific preferences |
| **Examples** | Your sandbox URLs, preferred test data, local env details |
| **Shared with** | Just you (current project) |
| **Note** | Automatically added to `.gitignore` |

## Loading Behavior

### At Session Start

1. All CLAUDE.md files in the directory hierarchy **above** the working directory are loaded in full
2. Project-level CLAUDE.md and rules are loaded
3. User-level CLAUDE.md and rules are loaded
4. Organization-level CLAUDE.md is loaded
5. Auto memory MEMORY.md (first 200 lines) is loaded

### On Demand

- CLAUDE.md files in **child** directories load when Claude reads files in those directories
- Auto memory topic files (e.g., `debugging.md`) are read when Claude needs them

### Precedence

More specific instructions take precedence over broader ones:
- Project local > Project shared > User > Organization
- Child directory > Parent directory
- Later instructions override earlier ones at the same level

## Settings That Affect Memory

```json
// .claude/settings.json or ~/.claude/settings.json
{
  "autoMemoryEnabled": false  // Disable auto memory
}
```

Environment variable override (takes precedence over all settings):
```bash
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=1  # Force off
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=0  # Force on
```
