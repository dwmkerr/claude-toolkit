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

Follow this pattern:

```markdown
# <repo-name>

<One-line description of what this project does.>

## Quickstart

<Minimal steps to get started - install and run.>
```

Example:

```markdown
# my-awesome-tool

CLI tool for automating deployment workflows.

## Quickstart

Install and run:

\`\`\`bash
npm install -g my-awesome-tool
my-awesome-tool init
\`\`\`
```

### 6. Initial Commit

```bash
git add LICENSE README.md
git commit -m "chore: initial project setup"
git push -u origin main
```

## Example Usage

User: "Create a new project called 'config-validator' for validating YAML configs"

1. `gh repo create config-validator --private --description "CLI tool for validating YAML configuration files" --clone`
2. Configure squash merges and branch protection
3. Create LICENSE and README
4. Push initial commit
