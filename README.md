# claude-toolkit

General purpose Claude Code toolkit with research agents, skills, and introspection commands.

## Quickstart

Add the marketplace and install the plugin:

```
/plugin marketplace add dwmkerr/claude-toolkit
/plugin install toolkit@claude-toolkit
```

For local development:

```bash
git clone https://github.com/dwmkerr/claude-toolkit.git
cd claude-toolkit
```

Then install locally:

```bash
claude plugin marketplace add ./
claude plugin install toolkit@claude-toolkit

# Or in Claude, use:
# /plugin marketplace add ./
# /plugin install toolkit@claude-toolkit
```

Uninstall if needed:

```bash
claude plugin marketplace remove claude-toolkit
# Or in Claude:
# /plugin marketplace remove claude-toolkit
```

## Contents

### Commands

#### `/toolkit:skill-history`

This is useful for troubleshooting whether Claude has actually invoked or missed skills, and in response to what queries.

![Screenshot of Skill History](./docs/examples/skill-history/skill-history.png)

See [skill history examples](./docs/examples/skill-history).

#### `/toolkit:agent-history`

> What agents have been spawned?

- Searches session log for agent spawns
- Shows timestamp, agent name, and task

### Skills

#### `research`

> Research options for implementing OAuth in a Node.js app

- Searches web and clones GitHub repos
- Requires 2-3 sources before recommending
- Saves findings to `./scratch/research/`

#### `claude-code-hook-development`

> Create a hook that runs tests before git push

- Creates shell scripts in `.claude/hooks/`
- Configures hook events in `.claude/settings.json`
- Supports blocking (exit 2) and non-blocking hooks

#### `skill-development`

> Create a skill for TypeScript development

- Creates `SKILL.md` with frontmatter
- Organizes references in subdirectories
- Follows progressive disclosure pattern

#### `agent-development`

> Create an agent for code review

- Creates agent markdown with YAML frontmatter
- Applies color conventions (blue=plan, green=create, etc.)
- Configures tools and permissions

#### `claude-code-slash-commands`

> Create a slash command for generating changelogs

- Creates command markdown in `.claude/commands/`
- Configures frontmatter (allowed-tools, argument-hint)
- Supports `$ARGUMENTS` and positional `$1`, `$2` params

#### `claude-code-statusline-development`

> Create a custom statusline showing git branch and context usage

- Creates shell scripts for `statusLine` in `.claude/settings.json`
- Provides JSON schema reference for session data
- Examples for git info, context percentage, cost tracking

#### `anthropic-evaluations`

> Create an evaluation suite for my coding agent

- Defines grader types (code-based, model-based, human)
- Patterns for coding, conversational, research, and computer use agents
- YAML templates for eval tasks
- Roadmap for building evals from scratch

#### `shell-script-development`

> Create a bash script for deployment

- Consistent shebang and safety options
- Color output conventions
- Status message patterns (success, error, warning)

#### `claude-code-plugin-development`

> Create a plugin that bundles my hooks and commands

- Creates plugin structure with `.claude-plugin/plugin.json`
- Bundles commands, agents, skills, hooks, MCP/LSP servers
- CLI commands for install, enable, disable, update
- Debugging guide with `claude --debug`

### Agents

#### `researcher`

> Research how to implement terminal recording in an MCP server

- Searches web for documentation and repos
- Clones GitHub repos to `/tmp` for examination
- Presents options with pros/cons and sources

## License

MIT
