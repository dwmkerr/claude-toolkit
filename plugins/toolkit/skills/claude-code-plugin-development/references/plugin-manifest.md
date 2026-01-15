# Plugin Manifest Reference

Complete `plugin.json` schema for Claude Code plugins.

**Official docs:** https://code.claude.com/docs/en/plugins-reference

## Complete Schema

```json
{
  "name": "plugin-name",
  "version": "1.2.0",
  "description": "Brief plugin description",
  "author": {
    "name": "Author Name",
    "email": "author@example.com",
    "url": "https://github.com/author"
  },
  "homepage": "https://docs.example.com/plugin",
  "repository": "https://github.com/author/plugin",
  "license": "MIT",
  "keywords": ["keyword1", "keyword2"],
  "commands": ["./custom/commands/special.md"],
  "agents": "./custom/agents/",
  "skills": "./custom/skills/",
  "hooks": "./config/hooks.json",
  "mcpServers": "./mcp-config.json",
  "outputStyles": "./styles/",
  "lspServers": "./.lsp.json"
}
```

## Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| name | string | Unique identifier (kebab-case, no spaces) | `"deployment-tools"` |

## Metadata Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| version | string | Semantic version | `"2.1.0"` |
| description | string | Brief explanation | `"Deployment automation"` |
| author | object | Author info | `{"name": "Dev", "email": "dev@co.com"}` |
| homepage | string | Documentation URL | `"https://docs.example.com"` |
| repository | string | Source code URL | `"https://github.com/user/plugin"` |
| license | string | License identifier | `"MIT"`, `"Apache-2.0"` |
| keywords | array | Discovery tags | `["deployment", "ci-cd"]` |

## Component Path Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| commands | string\|array | Additional command files/dirs | `"./custom/cmd.md"` |
| agents | string\|array | Additional agent files | `"./custom/agents/"` |
| skills | string\|array | Additional skill dirs | `"./custom/skills/"` |
| hooks | string\|object | Hook config path or inline | `"./hooks.json"` |
| mcpServers | string\|object | MCP config path or inline | `"./mcp-config.json"` |
| outputStyles | string\|array | Output style files/dirs | `"./styles/"` |
| lspServers | string\|object | LSP config path or inline | `"./.lsp.json"` |

## Path Behavior Rules

Custom paths **supplement** default directories—they don't replace them.

- If `commands/` exists, it's loaded in addition to custom command paths
- All paths must be relative and start with `./`
- Multiple paths can be specified as arrays:

```json
{
  "commands": [
    "./specialized/deploy.md",
    "./utilities/batch-process.md"
  ],
  "agents": [
    "./custom-agents/reviewer.md",
    "./custom-agents/tester.md"
  ]
}
```

## Version Management

Follow semantic versioning:

- **MAJOR**: Breaking changes (incompatible API changes)
- **MINOR**: New features (backward-compatible additions)
- **PATCH**: Bug fixes (backward-compatible fixes)

Pre-release versions: `2.0.0-beta.1`
