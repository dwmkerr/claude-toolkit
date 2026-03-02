---
description: Survey current state and suggest next tasks, or wrap up current work
allowed-tools: Bash(git:*), Bash(gh:*), Bash(cat:*), Bash(ls:*), Bash(grep:*), Read, Glob, Grep, AskUserQuestion
argument-hint: [done message]
---

# /next

## Arguments

$ARGUMENTS

## Context

- **Branch:** !`git branch --show-current`
- **Recent commits:** !`git log --oneline -10`
- **Working tree:** !`git status --short`
- **tasks.md:** !`cat tasks.md 2>/dev/null || echo "No tasks.md found"`
- **ideas.md:** !`cat ideas.md 2>/dev/null || echo "No ideas.md found"`
- **Framework detection:** !`ls -d .obra/ .openspec/ docs/plans/ 2>/dev/null || echo "No framework directories found"`
- **Open GitHub issues:** !`gh issue list --limit 5 --state open 2>/dev/null || echo "No GitHub issues or gh not configured"`

## Instructions

Determine the mode from the arguments above:

### Suggest Mode (default — no arguments, or arguments that aren't about wrapping up)

Analyze all the context above and produce:

1. **Current State** — 1-2 sentences: what branch we're on, what the recent work looks like, whether the working tree is clean
2. **Suggested Next Actions** — up to 5 bullet points, prioritized. Each bullet should:
   - Start with a source tag like `[tasks.md]`, `[GitHub #N]`, `[ideas.md]`, `[branch]`, or `[plan]`
   - Be a concrete, actionable next step
   - Be brief (one line)

If a development framework is detected (Obra Superpowers plans in `docs/plans/`, OpenSpec, etc.), check for active plans and include their next steps in the suggestions.

Present the bullets and stop. Do not start working on anything.

### Wrap-up Mode (arguments contain "done", "finished", "complete", "wrap up", or similar)

The user is finished with current work. Do:

1. **Summary** — briefly describe what was accomplished this session based on conversation history and recent commits
2. **Ask what to do next** using `AskUserQuestion` with these options:
   - **Create/update PR** — if on a feature branch with commits ahead of main
   - **Update tasks.md** — mark current task done, add any new tasks discovered
   - **Update ideas.md** — capture any ideas that came up during work
   - **Nothing, just summarize** — only show the summary
3. Execute whichever actions the user selects
