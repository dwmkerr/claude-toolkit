---
name: my-repos
description: Locate and work with dwmkerr's repositories. Use when user mentions "my repos", "my repo X", "check my repo", or needs to find/access a specific repository.
---

# My Repos

Guide for locating and working with dwmkerr's repositories.

## Repository Structure

```
~/repos/
├── github/
│   ├── dwmkerr/          # Personal repos (github.com/dwmkerr)
│   │   ├── effective-shell/
│   │   ├── hacker-laws/
│   │   ├── claude-toolkit/
│   │   └── ...
│   └── mckinsey/         # McKinsey open source repos (github.com/mckinsey)
│       └── ...
```

## Finding a Repository

### 1. Check Local First

Always check if the repo exists locally:

```bash
ls ~/repos/github/dwmkerr/<repo-name>
ls ~/repos/github/mckinsey/<repo-name>
```

### 2. If Local Repo Exists

When working with an existing local repo:

1. **Record the current state** before making changes:
   ```bash
   cd ~/repos/github/dwmkerr/<repo>
   ORIGINAL_BRANCH=$(git branch --show-current)
   git stash --include-untracked
   ```

2. **Fetch for reference** if you need other branches:
   ```bash
   git fetch origin
   git checkout origin/main  # or any branch for reference
   ```

3. **Always return to original state** when done:
   ```bash
   git checkout "$ORIGINAL_BRANCH"
   git stash pop
   ```

### 3. If Repo Not Found Locally

Check if it exists on GitHub:

```bash
gh repo view dwmkerr/<repo-name> --json name,url
```

If it exists remotely, clone it:

```bash
git clone https://github.com/dwmkerr/<repo-name> ~/repos/github/dwmkerr/<repo-name>
```

For McKinsey repos:

```bash
gh repo view mckinsey/<repo-name> --json name,url
git clone https://github.com/mckinsey/<repo-name> ~/repos/github/mckinsey/<repo-name>
```

## GitHub Details

- **Personal GitHub username**: `dwmkerr`
- **Personal repos path**: `~/repos/github/dwmkerr/`
- **McKinsey repos path**: `~/repos/github/mckinsey/`

## Common Repos

Some frequently accessed repositories:

- `effective-shell` - Book and website for shell/terminal skills
- `hacker-laws` - Laws, theories, and patterns for developers
- `claude-toolkit` - Claude Code plugins and skills
- `dotfiles` - Personal configuration files

## Example Usage

User: "Check my repo effective-shell for the chapter on pipes"

1. Check local: `ls ~/repos/github/dwmkerr/effective-shell`
2. If exists, work directly in the repo
3. Search for content: `grep -r "pipes" ~/repos/github/dwmkerr/effective-shell/`

User: "What branches are in my repo X?"

1. Locate repo locally or clone
2. `cd ~/repos/github/dwmkerr/X && git branch -a`
