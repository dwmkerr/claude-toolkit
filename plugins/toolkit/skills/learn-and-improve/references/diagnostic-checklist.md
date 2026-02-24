# Diagnostic Checklist

Systematic investigation steps when analyzing friction.

## 1. Review Conversation History

Look at the current session for:

- [ ] Tool calls that were blocked or prompted for permission
- [ ] Skills that were invoked — check if the right skill fired
- [ ] Agents that were spawned — check outcomes and any permission denials
- [ ] Error messages or unexpected behavior
- [ ] Repeated patterns (same friction occurring multiple times)

## 2. Check Permission Configuration

Read these files in order of precedence:

```
.claude/settings.local.json   → Project-local (highest priority)
.claude/settings.json          → Project-shared
~/.claude/settings.json        → User-global (lowest priority)
```

For each, check:
- [ ] `permissions.allow` — what's auto-allowed?
- [ ] `permissions.deny` — what's blocked?
- [ ] Are there conflicting rules across scopes?
- [ ] Are wildcard patterns broad enough? (e.g., `Bash(npm *)` vs `Bash(npm test)`)

## 3. Check CLAUDE.md Hierarchy

Read these files:

```
~/.claude/CLAUDE.md            → User instructions
./CLAUDE.md                    → Project instructions (or .claude/CLAUDE.md)
./CLAUDE.local.md              → Local overrides
.claude/rules/*.md             → Modular rules
```

Check:
- [ ] Is the instruction the user expects actually present?
- [ ] Is it at the right scope level?
- [ ] Are there conflicting instructions across levels?
- [ ] Are `@imports` resolving correctly?

## 4. Check Hooks

Look in settings files for `hooks` configuration:

- [ ] Is the expected hook event configured?
- [ ] Does the matcher pattern match the tool name?
- [ ] Is the hook script executable?
- [ ] Does the hook return the correct exit code / JSON?

## 5. Check Skills and Agents

For skills that misbehave:

- [ ] Read the SKILL.md frontmatter — check `description`, `allowed-tools`, `context`
- [ ] Is the skill from a plugin? Check `~/.claude/plugins/cache/`
- [ ] Does the skill's `description` contain the right trigger phrases?

For agents:

- [ ] Check `permissionMode` in agent frontmatter
- [ ] Check `tools` list — does it have what it needs?
- [ ] Check `model` — is it appropriate for the task?

## 6. Check MCP Servers

- [ ] Run `claude mcp list` (or read `.mcp.json` / `~/.claude.json`)
- [ ] Are the needed servers configured?
- [ ] Are MCP tool permissions in `settings.json`?

## 7. Check Installed Plugins

- [ ] List `~/.claude/plugins/cache/` to see installed plugins
- [ ] List `~/.claude/plugins/marketplaces/` to see available marketplaces
- [ ] Check if the relevant plugin is enabled in settings

## 8. Formulate Fix

After identifying the root cause:

1. Determine the narrowest scope that fixes the issue
2. Draft the exact change (JSON patch or markdown addition)
3. Verify no conflicts with existing configuration
4. Present to user with scope options and trade-offs
