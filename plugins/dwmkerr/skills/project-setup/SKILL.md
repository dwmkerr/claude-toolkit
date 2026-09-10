---
name: project-setup
description: Create a new GitHub project with standard configuration. Use when user asks to "create a project", "set up a new repo", "initialize a repository", or wants to start a new GitHub project.
# Run as subagent so setup executes autonomously
context: fork
---

# Project Setup

Create a new GitHub repository with standard dwmkerr project configuration.

## What Gets Created

1. **Private GitHub repo** with description
2. **Branch protection** - prevent direct push to main
3. **Squash merges only** for pull requests
4. **Actions can create PRs** enabled
5. **GitHub Pages** enabled (Actions-based deployment)
6. **MIT License**
7. **Basic README** with intro and quickstart
8. **Sponsor badge and funding metadata** - `.github/FUNDING.yml`, a "thanks | donate" badge in the README, and a `funding` field in `package.json` when present

## Setup Process

### 1. Create the Repository

```bash
gh repo create <repo-name> \
  --private \
  --description "<short description>" \
  --clone
```

### 2. Configure Repository Settings

```bash
# Require squash merges only, disable merge commits and rebase
gh api repos/dwmkerr/<repo-name> \
  --method PATCH \
  --field allow_squash_merge=true \
  --field allow_merge_commit=false \
  --field allow_rebase_merge=false \
  --field delete_branch_on_merge=true

# Allow GitHub Actions to create PRs
gh api repos/dwmkerr/<repo-name> \
  --method PATCH \
  --field allow_auto_merge=true

# For org repos, workflow write permissions must be enabled at the org level
# first, otherwise the repo-level call below will fail with a 409 Conflict.
# For personal repos this call will 404 harmlessly.
gh api orgs/dwmkerr/actions/permissions/workflow \
  --method PUT \
  --field can_approve_pull_request_reviews=true \
  --field default_workflow_permissions=write 2>/dev/null || true

gh api repos/dwmkerr/<repo-name>/actions/permissions/workflow \
  --method PUT \
  --field can_approve_pull_request_reviews=true \
  --field default_workflow_permissions=write

# Enable GitHub Pages with Actions-based deployment
gh api repos/dwmkerr/<repo-name>/pages \
  --method POST \
  --field "build_type=workflow"
```

### 3. Set Up Branch Protection Ruleset

```bash
gh api repos/dwmkerr/<repo-name>/rulesets \
  --method POST \
  --field name=main \
  --field target=branch \
  --field enforcement=active \
  --field 'conditions[ref_name][include][]=~DEFAULT_BRANCH' \
  --field 'rules[][type]=pull_request' \
  --field 'rules[][type]=deletion'
```

### 4. Create MIT License

Create `LICENSE` file:

```
MIT License

Copyright (c) 2025 Dave Kerr

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### 5. Create README

Follow this pattern. The badge row sits directly under the title, and the sponsor badge is always the last badge in that row:

```markdown
# <repo-name>

[![Donate](https://img.shields.io/badge/thanks-donate-ea4aaa?logo=githubsponsors&logoColor=white)](https://github.com/sponsors/dwmkerr/sponsorships?frequency=one-time&amount=5)

<One-line description of what this project does.>

## Quickstart

<Minimal steps to get started - install and run.>
```

Example:

```markdown
# my-awesome-tool

[![Donate](https://img.shields.io/badge/thanks-donate-ea4aaa?logo=githubsponsors&logoColor=white)](https://github.com/sponsors/dwmkerr/sponsorships?frequency=one-time&amount=5)

CLI tool for automating deployment workflows.

## Quickstart

Install and run:

\`\`\`bash
npm install -g my-awesome-tool
my-awesome-tool init
\`\`\`
```

### 6. Add Funding Metadata

Every public repo carries the same three pieces of funding metadata. The badge is the only ask in the README; do not add a "please sponsor" sentence.

Create `.github/FUNDING.yml`:

```yaml
# Support 'GitHub Sponsors' funding.
github: dwmkerr
```

The README badge from step 5 links to the one-time tab of the sponsors page.

If the project has a `package.json`, add the `funding` field:

```bash
jq '.funding = {"type": "github", "url": "https://github.com/sponsors/dwmkerr"}' package.json > package.json.tmp && mv package.json.tmp package.json
```

If the README uses a `<p align="center">` header block instead of a plain badge row, use the HTML anchor form as the last `<a>` in the badge paragraph:

```html
<a href="https://github.com/sponsors/dwmkerr/sponsorships?frequency=one-time&amount=5"><img src="https://img.shields.io/badge/thanks-donate-ea4aaa?logo=githubsponsors&logoColor=white" alt="Donate"></a>
```

### 7. Set Up Release Please (Optional)

Release Please automates version bumps and changelogs from conventional commits. Skip this step if the project doesn't need automated releases.

Create `release-please-config.json`. Adjust `release-type` to match the project (common values: `node`, `python`, `go`, `simple`):

```json
{
  "$schema": "https://raw.githubusercontent.com/googleapis/release-please/main/schemas/config.json",
  "include-component-in-tag": false,
  "packages": {
    ".": {
      "release-type": "node",
      "bump-minor-pre-major": true,
      "bump-patch-for-minor-pre-major": true
    }
  }
}
```

Create `.release-please-manifest.json`:

```json
{
  ".": "0.1.0"
}
```

**Version strategy for pre-1.0 projects:**

- `bump-minor-pre-major: true` — breaking changes bump minor (0.1.x → 0.2.0), not major
- `bump-patch-for-minor-pre-major: true` — `feat:` commits bump patch (0.1.0 → 0.1.1), not minor

Both flags are required to stay in the 0.1.x line. Without `bump-patch-for-minor-pre-major`, every `feat:` commit bumps the minor version (0.1 → 0.2 → 0.3), which burns through version numbers before the project is stable.

If the project has a version file (e.g. `package.json`), set its version to `0.1.0` to match the manifest.

### 8. Initial Commit

```bash
git add LICENSE README.md .github/FUNDING.yml
# Include release-please files only if step 7 was done
git add release-please-config.json .release-please-manifest.json 2>/dev/null || true
git commit -m "chore: initial project setup"
git push -u origin main
```

## Example Usage

User: "Create a new project called 'config-validator' for validating YAML configs"

1. `gh repo create config-validator --private --description "CLI tool for validating YAML configuration files" --clone`
2. Configure squash merges and branch protection
3. Create LICENSE and README
4. Push initial commit
