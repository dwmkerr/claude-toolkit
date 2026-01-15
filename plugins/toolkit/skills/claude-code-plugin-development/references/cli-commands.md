# CLI Commands Reference

Plugin management commands for Claude Code.

**Official docs:** https://code.claude.com/docs/en/plugins-reference

## plugin install

Install a plugin from available marketplaces.

```bash
claude plugin install <plugin> [options]
```

**Arguments:**
- `<plugin>`: Plugin name or `plugin-name@marketplace-name`

**Options:**

| Option | Description | Default |
|--------|-------------|---------|
| `-s, --scope <scope>` | Installation scope: user, project, local | user |
| `-h, --help` | Display help | |

**Examples:**

```bash
# Install to user scope (default)
claude plugin install formatter@my-marketplace

# Install to project scope (shared with team)
claude plugin install formatter@my-marketplace --scope project

# Install to local scope (gitignored)
claude plugin install formatter@my-marketplace --scope local
```

## plugin uninstall

Remove an installed plugin.

```bash
claude plugin uninstall <plugin> [options]
```

**Arguments:**
- `<plugin>`: Plugin name or `plugin-name@marketplace-name`

**Options:**

| Option | Description | Default |
|--------|-------------|---------|
| `-s, --scope <scope>` | Scope: user, project, local | user |
| `-h, --help` | Display help | |

**Aliases:** `remove`, `rm`

## plugin enable

Enable a disabled plugin.

```bash
claude plugin enable <plugin> [options]
```

**Arguments:**
- `<plugin>`: Plugin name or `plugin-name@marketplace-name`

**Options:**

| Option | Description | Default |
|--------|-------------|---------|
| `-s, --scope <scope>` | Scope: user, project, local | user |
| `-h, --help` | Display help | |

## plugin disable

Disable a plugin without uninstalling it.

```bash
claude plugin disable <plugin> [options]
```

**Arguments:**
- `<plugin>`: Plugin name or `plugin-name@marketplace-name`

**Options:**

| Option | Description | Default |
|--------|-------------|---------|
| `-s, --scope <scope>` | Scope: user, project, local | user |
| `-h, --help` | Display help | |

## plugin update

Update a plugin to the latest version.

```bash
claude plugin update <plugin> [options]
```

**Arguments:**
- `<plugin>`: Plugin name or `plugin-name@marketplace-name`

**Options:**

| Option | Description | Default |
|--------|-------------|---------|
| `-s, --scope <scope>` | Scope: user, project, local, managed | user |
| `-h, --help` | Display help | |

## Installation Scopes

| Scope | Settings File | Use Case |
|-------|---------------|----------|
| user | `~/.claude/settings.json` | Personal plugins (default) |
| project | `.claude/settings.json` | Team plugins via version control |
| local | `.claude/settings.local.json` | Project-specific, gitignored |
| managed | `managed-settings.json` | Read-only managed plugins |
