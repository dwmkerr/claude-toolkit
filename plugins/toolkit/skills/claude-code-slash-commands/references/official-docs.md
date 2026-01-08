# Official Slash Commands Documentation

> Source: https://code.claude.com/docs/en/slash-commands

## Custom Slash Commands

Custom slash commands allow you to define frequently used prompts as Markdown files that Claude Code can execute. Commands are organized by scope (project-specific or personal) and support namespacing through directory structures.

Slash command autocomplete works anywhere in your input, not just at the beginning. Type `/` at any position to see available commands.

## Syntax

```
/<command-name> [arguments]
```

### Parameters

| Parameter | Description |
|-----------|-------------|
| `<command-name>` | Name derived from the Markdown filename (without `.md` extension) |
| `[arguments]` | Optional arguments passed to the command |

## Command Types

### Project Commands

Commands stored in your repository and shared with your team. When listed in `/help`, these commands show "(project)" after their description.

**Location:** `.claude/commands/`

```bash
# Create a project command
mkdir -p .claude/commands
echo "Analyze this code for performance issues and suggest optimizations:" > .claude/commands/optimize.md
```

### Personal Commands

Commands available across all your projects. When listed in `/help`, these commands show "(user)" after their description.

**Location:** `~/.claude/commands/`

```bash
# Create a personal command
mkdir -p ~/.claude/commands
echo "Review this code for security vulnerabilities:" > ~/.claude/commands/security-review.md
```

## Features

### Namespacing

Use subdirectories to group related commands. Subdirectories appear in the command description but don't affect the command name.

For example:
- `.claude/commands/frontend/component.md` creates `/component` with description "(project:frontend)"
- `~/.claude/commands/component.md` creates `/component` with description "(user)"

If a project command and user command share the same name, the project command takes precedence and the user command is silently ignored.

Commands in different subdirectories can share names since the subdirectory appears in the description to distinguish them.

### Arguments

**All arguments with `$ARGUMENTS`:**

The `$ARGUMENTS` placeholder captures all arguments passed to the command:

```markdown
# Command definition
Fix issue #$ARGUMENTS following our coding standards

# Usage: /fix-issue 123 high-priority
# $ARGUMENTS becomes: "123 high-priority"
```

**Individual arguments with `$1`, `$2`, etc.:**

Access specific arguments individually using positional parameters:

```markdown
# Command definition
Review PR #$1 with priority $2 and assign to $3

# Usage: /review-pr 456 high alice
# $1 becomes "456", $2 becomes "high", $3 becomes "alice"
```

### Bash Command Execution

<!-- NOTE: Avoid isolated special chars in backticks due to bug #12762 -->
Execute bash commands before the slash command runs using the exclamation mark (!) prefix. The output is included in the command context. You must include `allowed-tools` with the Bash tool.

```text
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
description: Create a git commit
---

## Context

- Current git status: EXCLAMATION_MARK`git status`
- Current git diff: EXCLAMATION_MARK`git diff HEAD`
- Current branch: EXCLAMATION_MARK`git branch --show-current`
- Recent commits: EXCLAMATION_MARK`git log --oneline -10`

## Your task

Based on the above changes, create a single git commit.
```

**Note**: Replace EXCLAMATION_MARK with the exclamation mark character in actual commands. Workaround for [bug #12762](https://github.com/anthropics/claude-code/issues/12762).

### File References

Include file contents in commands using the at-sign (@) prefix:

```markdown
# Reference a specific file
Review the implementation in @src/utils/helpers.js

# Reference multiple files
Compare @src/old-version.js with @src/new-version.js
```

### Thinking Mode

Slash commands can trigger extended thinking by including extended thinking keywords.

## Frontmatter

| Frontmatter | Purpose | Default |
|-------------|---------|---------|
| `allowed-tools` | List of tools the command can use | Inherits from conversation |
| `argument-hint` | Arguments expected (shown in autocomplete) | None |
| `description` | Brief description of the command | Uses first line from prompt |
| `model` | Specific model string | Inherits from conversation |
| `disable-model-invocation` | Prevent SlashCommand tool from calling this | false |

Example:

```yaml
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
argument-hint: [message]
description: Create a git commit
model: claude-3-5-haiku-20241022
---

Create a git commit with message: $ARGUMENTS
```

## Plugin Commands

Plugins can provide custom slash commands that integrate seamlessly with Claude Code.

**Location:** `commands/` directory in plugin root

### Invocation Patterns

- Direct: `/command-name`
- Plugin-prefixed: `/plugin-name:command-name`
- With arguments: `/command-name arg1 arg2`

## Skills vs Slash Commands

| Aspect | Slash Commands | Agent Skills |
|--------|----------------|--------------|
| Complexity | Simple prompts | Complex capabilities |
| Structure | Single `.md` file | Directory with SKILL.md + resources |
| Discovery | Explicit invocation (`/command`) | Automatic (based on context) |
| Files | One file only | Multiple files, scripts, templates |

**Use slash commands for:**
- Quick, frequently used prompts
- Simple prompt snippets
- Frequently used instructions that fit in one file

**Use Skills for:**
- Complex workflows with multiple steps
- Capabilities requiring scripts or utilities
- Knowledge organized across multiple files
