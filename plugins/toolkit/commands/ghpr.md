---
description: Open or create GitHub pull request for current branch
allowed-tools: Bash(${CLAUDE_PLUGIN_ROOT}/scripts/ghpr.sh:*), Bash(gh:*), Bash(git:*), AskUserQuestion, Skill
---

# GitHub Pull Request

Open or create a pull request for the current branch.

## Context

- Current branch: !`git branch --show-current`
- Recent commits on this branch: !`git log main..HEAD --oneline 2>/dev/null || git log origin/main..HEAD --oneline 2>/dev/null || echo "Unable to determine commits"`

## Instructions

### Step 1: Check if PR exists (fast path)

Run the ghpr script:

```bash
${CLAUDE_PLUGIN_ROOT}/scripts/ghpr.sh
```

- **If it shows "✔ opened: <url>"**: The PR was opened in the browser. Confirm this to the user and **stop**.
- **If it shows "NO_PR"**: Continue to Step 2.

### Step 2: Check for relevant skills

Before creating a PR, check available skills for any that might provide PR guidance:
- Look for `<project>-development` skills (e.g., `ark-development`, `typescript-development`) if this is engineering work
- Look for `pull-request` or `pr-guidance` skills
- Review the conversation history for context about what was implemented

If relevant skills exist, invoke them to get project-specific PR conventions.

### Step 3: Create PR (if none exists)

a. Analyze the branch name and commits to determine the type:
   - `feat/` branch or feature commits → `feat:`
   - `fix/` branch or bugfix commits → `fix:`
   - `chore/` branch or maintenance commits → `chore:`
   - `docs/` branch → `docs:`
   - `refactor/` branch → `refactor:`

b. Draft a PR title following conventional commit format (e.g., `feat: add ghpr command`)

c. Draft a PR body using this format:
   ```
   ## Summary
   - Brief description of changes
   ```

d. Present the suggested title and body to the user using AskUserQuestion:
   - Show the proposed title
   - Show the proposed body
   - Ask for confirmation or edits

e. If confirmed, create the PR:
   ```bash
   gh pr create --title "..." --body "..."
   ```

f. Report the PR URL to the user.
