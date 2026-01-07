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

```
/plugin marketplace add ./
/plugin install toolkit@claude-toolkit
```

Uninstall if needed:

```
/plugin marketplace remove claude-toolkit
```

## Contents

### Commands

| Command | Description |
|---------|-------------|
| `/toolkit:skill-history` | Show skills invoked this session |
| `/toolkit:agent-history` | Show agents spawned this session |

### Skills

| Skill | Description |
|-------|-------------|
| `research` | Structured research methodology with evidence requirements |
| `claude-code-hook-development` | Create hooks for guardrails, automations, and policy enforcement |

### Agents

| Agent | Description |
|-------|-------------|
| `researcher` | Research technical solutions via web search and GitHub repos |

## License

MIT
