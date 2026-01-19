# Multi-Package Pattern

Use this pattern for monorepos with multiple independently versioned components: services, libraries, Helm charts.

## File Structure

```
your-monorepo/
├── .github/
│   ├── release-please-config.json
│   ├── release-please-manifest.json
│   └── workflows/
│       └── release.yaml
├── CHANGELOG.md              # Root changelog
├── docs/
│   └── CHANGELOG.md          # Docs changelog
├── services/
│   ├── api/
│   │   └── CHANGELOG.md
│   └── worker/
│       └── CHANGELOG.md
└── packages/
    └── shared/
        └── CHANGELOG.md
```

## Configuration

### release-please-config.json

```json
{
  "bump-minor-pre-major": false,
  "bump-patch-for-minor-pre-major": true,
  "packages": {
    ".": {
      "changelog-path": "CHANGELOG.md",
      "release-type": "simple"
    },
    "docs": {
      "changelog-path": "CHANGELOG.md",
      "release-type": "node",
      "package-name": "my-docs"
    },
    "services/api": {
      "changelog-path": "CHANGELOG.md",
      "release-type": "node",
      "package-name": "api-service"
    },
    "services/worker": {
      "changelog-path": "CHANGELOG.md",
      "release-type": "node",
      "package-name": "worker-service"
    },
    "packages/shared": {
      "changelog-path": "CHANGELOG.md",
      "release-type": "node",
      "package-name": "@myorg/shared"
    }
  }
}
```

### release-please-manifest.json

```json
{
  ".": "1.0.0",
  "docs": "0.2.0",
  "services/api": "2.1.0",
  "services/worker": "1.5.0",
  "packages/shared": "0.8.0"
}
```

Each package tracks its version independently.

## Helm Charts

For Kubernetes Helm charts, use `release-type: helm`:

```json
{
  "packages": {
    "charts/my-service": {
      "changelog-path": "CHANGELOG.md",
      "release-type": "helm",
      "package-name": "my-service",
      "extra-files": [
        "Chart.yaml"
      ]
    }
  }
}
```

Release-please automatically updates:
- `version` in Chart.yaml
- CHANGELOG.md

## GitHub Workflow with Conditional Jobs

Advanced workflow that runs jobs only for packages that were released:

```yaml
name: Release

on:
  push:
    branches: [main]

permissions:
  contents: write
  pull-requests: write
  packages: write

jobs:
  release-please:
    name: Create Release
    runs-on: ubuntu-latest
    outputs:
      released: ${{ steps.release-please.outputs.release_created }}
      rp_outputs: ${{ toJSON(steps.release-please.outputs) }}
    steps:
      - uses: googleapis/release-please-action@v4
        id: release-please
        with:
          config-file: .github/release-please-config.json
          manifest-file: .github/release-please-manifest.json

  # Run only when a specific package is released
  deploy-api:
    name: Deploy API Service
    needs: [release-please]
    if: ${{ fromJSON(needs.release-please.outputs.rp_outputs)['services/api--release_created'] == 'true' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Get version
        run: |
          echo "Version: ${{ fromJSON(needs.release-please.outputs.rp_outputs)['services/api--tag_name'] }}"
      # Deploy steps...

  deploy-worker:
    name: Deploy Worker Service
    needs: [release-please]
    if: ${{ fromJSON(needs.release-please.outputs.rp_outputs)['services/worker--release_created'] == 'true' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      # Deploy steps...
```

## Release Please Outputs

For each package, release-please provides outputs:

| Output | Description |
|--------|-------------|
| `<path>--release_created` | `true` if package was released |
| `<path>--tag_name` | Tag name (e.g., `api-service-v2.1.0`) |
| `<path>--version` | Version number (e.g., `2.1.0`) |
| `<path>--major`, `<path>--minor`, `<path>--patch` | Version components |

Access in workflow:
```yaml
${{ fromJSON(needs.release-please.outputs.rp_outputs)['services/api--release_created'] }}
${{ fromJSON(needs.release-please.outputs.rp_outputs)['services/api--tag_name'] }}
```

## Commit Scoping

Scope commits to specific packages:

```bash
# Affects services/api
git commit -m "feat(services/api): add new endpoint"

# Affects packages/shared
git commit -m "fix(packages/shared): resolve type error"

# Affects root package
git commit -m "docs: update main README"
```

Release-please uses the path in the scope to determine which package to update.

## Real-World Example

From a production monorepo with services and Helm charts:

```json
{
  "bump-minor-pre-major": false,
  "bump-patch-for-minor-pre-major": true,
  "packages": {
    ".": {
      "changelog-path": "CHANGELOG.md",
      "release-type": "simple"
    },
    "docs": {
      "changelog-path": "CHANGELOG.md",
      "release-type": "node",
      "package-name": "marketplace-docs"
    },
    "services/langfuse": {
      "changelog-path": "CHANGELOG.md",
      "release-type": "helm",
      "package-name": "langfuse",
      "extra-files": ["chart/Chart.yaml"]
    },
    "services/phoenix": {
      "changelog-path": "CHANGELOG.md",
      "release-type": "helm",
      "package-name": "phoenix",
      "extra-files": ["chart/Chart.yaml"]
    },
    "agents/noah": {
      "changelog-path": "CHANGELOG.md",
      "release-type": "helm",
      "package-name": "noah",
      "extra-files": ["chart/Chart.yaml"]
    }
  }
}
```

With manifest tracking independent versions:

```json
{
  ".": "0.1.20",
  "docs": "0.1.10",
  "services/langfuse": "0.1.5",
  "services/phoenix": "0.1.7",
  "agents/noah": "0.1.8"
}
```

## Tips

1. **Start simple**: Begin with just the packages you need, add more later
2. **Consistent naming**: Use `package-name` to control how releases are named
3. **Scope commits**: Always scope commits to the relevant package path
4. **Test outputs**: Log `rp_outputs` to understand available data for conditional jobs
