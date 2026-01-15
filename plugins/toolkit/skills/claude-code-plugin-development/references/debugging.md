# Debugging Reference

Debugging tools and common issues for Claude Code plugins.

**Official docs:** https://code.claude.com/docs/en/plugins-reference

## Debug Mode

Run Claude Code with debug output:

```bash
claude --debug
```

Shows:
- Which plugins are being loaded
- Errors in plugin manifests
- Command, agent, and hook registration
- MCP server initialization

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Plugin not loading | Invalid plugin.json | Validate JSON syntax with `/plugin validate` |
| Commands not appearing | Wrong directory structure | Components at root, not in `.claude-plugin/` |
| Hooks not firing | Script not executable | `chmod +x script.sh` |
| MCP server fails | Missing `${CLAUDE_PLUGIN_ROOT}` | Use variable for all plugin paths |
| Path errors | Absolute paths used | All paths must be relative, start with `./` |
| LSP "Executable not found" | Server not installed | Install binary (e.g., `npm install -g typescript-language-server`) |

## Error Messages

### Manifest Validation Errors

**Invalid JSON syntax:**
```
Unexpected token } in JSON at position 142
```
Check for missing commas, extra commas, or unquoted strings.

**Missing required field:**
```
Plugin has an invalid manifest file at .claude-plugin/plugin.json.
Validation errors: name: Required
```

**Parse error:**
```
Plugin has a corrupt manifest file at .claude-plugin/plugin.json.
JSON parse error: ...
```

### Plugin Loading Errors

**No commands found:**
```
Warning: No commands found in plugin my-plugin custom directory: ./cmds
```
Command path exists but contains no valid `.md` files.

**Directory not found:**
```
Plugin directory not found at path: ./plugins/my-plugin
```
The source path in marketplace.json points to non-existent directory.

**Conflicting manifests:**
```
Plugin my-plugin has conflicting manifests
```
Remove duplicate component definitions or set `strict: true` in marketplace entry.

## Hook Troubleshooting

### Script Not Executing

1. Check script is executable: `chmod +x ./scripts/your-script.sh`
2. Verify shebang line: `#!/bin/bash` or `#!/usr/bin/env bash`
3. Check path uses `${CLAUDE_PLUGIN_ROOT}`:
   ```json
   "command": "${CLAUDE_PLUGIN_ROOT}/scripts/your-script.sh"
   ```
4. Test manually: `./scripts/your-script.sh`

### Hook Not Triggering

1. Event name is case-sensitive: `PostToolUse`, not `postToolUse`
2. Check matcher pattern: `"matcher": "Write|Edit"` for file operations
3. Confirm hook type is valid: `command`, `prompt`, or `agent`

## MCP Server Troubleshooting

### Server Not Starting

1. Check command exists and is executable
2. Verify all paths use `${CLAUDE_PLUGIN_ROOT}`
3. Check MCP logs: `claude --debug` shows initialization errors
4. Test server manually outside Claude Code

### Server Tools Not Appearing

1. Ensure proper configuration in `.mcp.json` or `plugin.json`
2. Verify server implements MCP protocol correctly
3. Check for connection timeouts in debug output

## Directory Structure Mistakes

**Symptoms:** Plugin loads but components missing.

**Correct structure:**
```
my-plugin/
├── .claude-plugin/
│   └── plugin.json      ← Only manifest here
├── commands/            ← At root level
├── agents/              ← At root level
└── hooks/               ← At root level
```

If components are inside `.claude-plugin/`, move them to plugin root.

## Debug Checklist

1. Run `claude --debug` and look for "loading plugin" messages
2. Check each component directory listed in debug output
3. Verify file permissions allow reading plugin files
4. Test scripts manually before adding to hooks
5. Validate JSON files with a linter

## Plugin Caching

Claude Code copies plugins to a cache directory for security. Important implications:

- Plugins cannot reference files outside their copied directory
- Use symlinks for external dependencies (honored during copy)
- Or restructure marketplace to include all required files
