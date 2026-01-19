# Configuration Reference

Complete reference for release-please configuration options.

## Config File Structure

```json
{
  "release-type": "simple",
  "bump-minor-pre-major": false,
  "bump-patch-for-minor-pre-major": true,
  "include-component-in-tag": false,
  "packages": {
    ".": {
      // Package-specific options
    }
  }
}
```

## Global Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `release-type` | string | `node` | Default release type for all packages |
| `bump-minor-pre-major` | boolean | `true` | Bump minor for `feat:` commits pre-1.0 |
| `bump-patch-for-minor-pre-major` | boolean | `false` | Bump patch for `feat:` commits pre-1.0 |
| `include-component-in-tag` | boolean | `true` | Include package name in git tag |
| `separate-pull-requests` | boolean | `false` | Create separate PRs per package |
| `changelog-sections` | array | - | Customize changelog sections |

## Release Types

| Type | Files Updated | Use Case |
|------|---------------|----------|
| `simple` | CHANGELOG.md only | Generic projects |
| `node` | package.json, package-lock.json | Node.js packages |
| `python` | setup.py, setup.cfg, pyproject.toml | Python packages |
| `go` | - | Go modules (tag-based) |
| `rust` | Cargo.toml | Rust crates |
| `helm` | Chart.yaml | Kubernetes Helm charts |
| `java` | pom.xml | Maven projects |
| `php` | composer.json | PHP packages |
| `ruby` | *.gemspec | Ruby gems |
| `elixir` | mix.exs | Elixir packages |
| `terraform-module` | - | Terraform modules |
| `ocaml` | *.opam | OCaml packages |
| `maven` | pom.xml | Maven (alternative) |
| `dart` | pubspec.yaml | Dart/Flutter packages |
| `krm-blueprint` | - | KRM blueprints |
| `expo` | app.json | Expo apps |

## Package Options

| Option | Type | Description |
|--------|------|-------------|
| `release-type` | string | Override global release-type |
| `package-name` | string | Name used in releases and tags |
| `changelog-path` | string | Path to CHANGELOG (relative to package) |
| `changelog-host` | string | Base URL for commit links |
| `extra-files` | array | Additional files to update version in |
| `include-component-in-tag` | boolean | Override global setting |
| `draft` | boolean | Create draft releases |
| `prerelease` | boolean | Mark as prerelease |

## Extra Files

### JSON Files

```json
{
  "type": "json",
  "path": "config.json",
  "jsonpath": "$.version"
}
```

JSONPath supports:
- `$.version` - Root level
- `$.package.version` - Nested
- `$.plugins[0].version` - Array index

### YAML Files

```json
{
  "type": "yaml",
  "path": "values.yaml",
  "jsonpath": "$.image.tag"
}
```

### XML Files

```json
{
  "type": "xml",
  "path": "pom.xml",
  "xpath": "//project/version"
}
```

### Generic Files

```json
{
  "type": "generic",
  "path": "version.txt"
}
```

Matches and replaces `x.y.z` patterns.

### TOML Files

```json
{
  "type": "toml",
  "path": "pyproject.toml",
  "jsonpath": "$.project.version"
}
```

## Changelog Sections

Customize how commits are grouped:

```json
{
  "changelog-sections": [
    {"type": "feat", "section": "Features"},
    {"type": "fix", "section": "Bug Fixes"},
    {"type": "perf", "section": "Performance"},
    {"type": "revert", "section": "Reverts"},
    {"type": "docs", "section": "Documentation", "hidden": true},
    {"type": "style", "section": "Styles", "hidden": true},
    {"type": "chore", "section": "Miscellaneous", "hidden": true},
    {"type": "refactor", "section": "Code Refactoring", "hidden": true},
    {"type": "test", "section": "Tests", "hidden": true},
    {"type": "build", "section": "Build System", "hidden": true},
    {"type": "ci", "section": "CI/CD", "hidden": true}
  ]
}
```

Set `hidden: true` to exclude from changelog.

## GitHub Action Options

```yaml
- uses: googleapis/release-please-action@v4
  with:
    # Required
    config-file: .github/release-please-config.json
    manifest-file: .github/release-please-manifest.json

    # Optional
    token: ${{ secrets.CUSTOM_TOKEN }}  # Default: GITHUB_TOKEN
    target-branch: main                  # Default: repo default branch
    skip-github-release: false           # Skip creating GitHub release
    skip-github-pull-request: false      # Skip creating PR
    fork: false                          # Create PR from fork
```

## Manifest File

Tracks current versions for each package:

```json
{
  ".": "1.0.0",
  "packages/core": "2.3.1",
  "services/api": "0.5.0"
}
```

- Keys are paths relative to repo root
- Values are current semantic versions
- `.` represents the root package

## Conventional Commit Reference

| Commit Type | Version Bump | Changelog Section |
|-------------|--------------|-------------------|
| `feat:` | Minor (or patch pre-1.0) | Features |
| `fix:` | Patch | Bug Fixes |
| `feat!:` | Major | Features (Breaking) |
| `fix!:` | Major | Bug Fixes (Breaking) |
| `BREAKING CHANGE:` in body | Major | (varies) |
| `docs:` | None | Documentation |
| `chore:` | None | Miscellaneous |
| `refactor:` | None | Code Refactoring |
| `test:` | None | Tests |
| `ci:` | None | CI/CD |
| `build:` | None | Build System |
| `perf:` | Patch | Performance |

## Troubleshooting

### Release PR Not Created

1. Ensure commits follow conventional format
2. Check workflow has `contents: write` and `pull-requests: write` permissions
3. Verify manifest versions match actual state

### Wrong Version Bump

1. Check `bump-minor-pre-major` and `bump-patch-for-minor-pre-major` settings
2. Verify commit message format
3. Check if `BREAKING CHANGE` is in commit body

### Extra Files Not Updated

1. Verify file path is correct (relative to repo root)
2. Check jsonpath/xpath syntax
3. Ensure file exists before release-please runs
