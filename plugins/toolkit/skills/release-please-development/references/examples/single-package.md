# Single Package Pattern

Use this pattern for repositories with one releasable unit: libraries, CLIs, simple applications.

## File Structure

```
your-repo/
├── .github/
│   ├── release-please-config.json
│   ├── release-please-manifest.json
│   └── workflows/
│       └── release.yaml
├── CHANGELOG.md          # Auto-generated
└── your-code/
```

## Configuration

### release-please-config.json

```json
{
  "release-type": "simple",
  "bump-minor-pre-major": false,
  "bump-patch-for-minor-pre-major": true,
  "include-component-in-tag": false,
  "packages": {
    ".": {
      "release-type": "simple",
      "changelog-path": "CHANGELOG.md"
    }
  }
}
```

### release-please-manifest.json

```json
{
  ".": "0.1.0"
}
```

**Note:** Set initial version to match your current release or `0.0.1` for new projects.

### GitHub Workflow

```yaml
name: Release

on:
  push:
    branches: [main]

permissions:
  contents: write
  pull-requests: write

jobs:
  release:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: googleapis/release-please-action@v4
        with:
          config-file: .github/release-please-config.json
          manifest-file: .github/release-please-manifest.json
```

## Updating Version in Other Files

Use `extra-files` to keep versions in sync across multiple files:

### JSON Files

```json
{
  "packages": {
    ".": {
      "extra-files": [
        {
          "type": "json",
          "path": "package.json",
          "jsonpath": "$.version"
        },
        {
          "type": "json",
          "path": "manifest.json",
          "jsonpath": "$.plugins[0].version"
        }
      ]
    }
  }
}
```

### YAML Files

```json
{
  "packages": {
    ".": {
      "extra-files": [
        {
          "type": "yaml",
          "path": "config.yaml",
          "jsonpath": "$.version"
        }
      ]
    }
  }
}
```

### Generic Files (Regex)

```json
{
  "packages": {
    ".": {
      "extra-files": [
        {
          "type": "generic",
          "path": "version.txt"
        }
      ]
    }
  }
}
```

For generic files, release-please looks for patterns like `x.y.z` and updates them.

## Example: Claude Plugin

Real-world example from claude-toolkit:

```json
{
  "release-type": "simple",
  "bump-minor-pre-major": false,
  "bump-patch-for-minor-pre-major": true,
  "include-component-in-tag": false,
  "packages": {
    ".": {
      "release-type": "simple",
      "changelog-path": "CHANGELOG.md",
      "extra-files": [
        {
          "type": "json",
          "path": ".claude-plugin/marketplace.json",
          "jsonpath": "$.plugins[0].version"
        }
      ]
    }
  }
}
```

This updates both the CHANGELOG and the version in the plugin manifest.

## Version Numbering

- **Pre-1.0**: `feat:` bumps patch (0.0.x → 0.0.y) due to `bump-patch-for-minor-pre-major: true`
- **Post-1.0**: `feat:` bumps minor (1.0.0 → 1.1.0)
- **Breaking changes**: Always bump major when using `feat!:` or `BREAKING CHANGE`

## Tags

With `include-component-in-tag: false`, tags are simple: `v1.0.0`

With `include-component-in-tag: true`, tags include the package name: `my-package-v1.0.0`
