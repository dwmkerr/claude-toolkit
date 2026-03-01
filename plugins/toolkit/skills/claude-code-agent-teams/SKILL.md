---
name: claude-code-agent-teams
description: This skill should be used when the user asks to "create an agent team", "run a multi-agent team", "coordinate multiple Claude sessions", "use agent teams", or wants to parallelize work across multiple Claude Code instances.
allowed-tools: Read, Grep
---

# Claude Code Agent Teams

Coordinate multiple Claude Code instances working together as a team with shared tasks, inter-agent messaging, and centralized management.

## Quick Reference

See [Agent Teams Guide](./references/agent-teams-guide.md) for the complete reference including use case examples, architecture details, and troubleshooting.

## Prerequisites

Agent teams are experimental and disabled by default. Enable them:

```json
// settings.json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

## When to Use Agent Teams

Best for tasks where parallel exploration adds value:

| Use Case | Why Teams Help |
|----------|---------------|
| Research and review | Multiple angles investigated simultaneously |
| New modules or features | Each teammate owns a separate piece |
| Debugging competing hypotheses | Test different theories in parallel |
| Cross-layer coordination | Frontend, backend, tests each owned by a teammate |

**Don't use teams for:** sequential tasks, same-file edits, or work with many dependencies. Use a single session or subagents instead.

## Agent Teams vs Subagents

| | Subagents | Agent Teams |
|---|---|---|
| **Context** | Results return to caller | Fully independent |
| **Communication** | Report back only | Message each other directly |
| **Coordination** | Main agent manages all work | Shared task list, self-coordination |
| **Best for** | Focused tasks where only the result matters | Complex work requiring discussion |
| **Token cost** | Lower | Higher (each teammate is a separate instance) |

Use subagents for quick focused workers. Use agent teams when teammates need to share findings, challenge each other, and coordinate independently.

## Starting a Team

Tell Claude to create a team in natural language:

```text
I'm designing a CLI tool that helps developers track TODO comments across
their codebase. Create an agent team to explore this from different angles: one
teammate on UX, one on technical architecture, one playing devil's advocate.
```

Claude creates the team, spawns teammates, and coordinates work.

## Display Modes

| Mode | Description | Requirements |
|------|-------------|-------------|
| `in-process` | All teammates in main terminal, Shift+Down to cycle | Any terminal |
| `tmux` / split panes | Each teammate in its own pane | tmux or iTerm2 |
| `auto` (default) | Split panes if in tmux, otherwise in-process | — |

Override per-session:

```bash
claude --teammate-mode in-process
```

Or in settings:

```json
{
  "teammateMode": "in-process"
}
```

## Controlling the Team

### Specify teammates and models

```text
Create a team with 4 teammates to refactor these modules in parallel.
Use Sonnet for each teammate.
```

### Require plan approval

```text
Spawn an architect teammate to refactor the authentication module.
Require plan approval before they make any changes.
```

The lead reviews plans and approves or rejects with feedback.

### Talk to teammates directly

- **In-process**: Shift+Down to cycle, Enter to view, Escape to interrupt
- **Split panes**: Click into a teammate's pane

### Task management

Tasks have three states: pending, in progress, completed. Tasks can depend on other tasks. The lead assigns tasks or teammates self-claim. Press Ctrl+T to toggle the task list.

### Shut down and clean up

```text
Ask the researcher teammate to shut down
```

When done:

```text
Clean up the team
```

Always use the lead to clean up. Shut down all teammates first.

## Quality Gates with Hooks

- `TeammateIdle` — runs when a teammate is about to go idle. Exit code 2 sends feedback and keeps them working.
- `TaskCompleted` — runs when a task is marked complete. Exit code 2 prevents completion and sends feedback.

## Best Practices

1. **Give enough context** — teammates don't inherit the lead's conversation history. Include details in spawn prompts.
2. **Start with 3-5 teammates** — balances parallelism with coordination overhead.
3. **5-6 tasks per teammate** — keeps everyone productive.
4. **Avoid file conflicts** — each teammate should own different files.
5. **Monitor and steer** — check progress, redirect approaches that aren't working.
6. **Start with research/review** — before trying parallel implementation.

## Limitations

- No session resumption for in-process teammates (`/resume`, `/rewind` don't restore them)
- Task status can lag — check and update manually if stuck
- One team per session
- No nested teams (teammates can't spawn their own teams)
- Lead is fixed for the team's lifetime
- All teammates start with the lead's permission mode
- Split panes require tmux or iTerm2 (not supported in VS Code terminal, Windows Terminal, or Ghostty)

## Architecture

| Component | Role |
|-----------|------|
| Team lead | Main session that creates team, spawns teammates, coordinates |
| Teammates | Separate Claude Code instances working on assigned tasks |
| Task list | Shared work items that teammates claim and complete |
| Mailbox | Messaging system for inter-agent communication |

Storage locations:

- Team config: `~/.claude/teams/{team-name}/config.json`
- Task list: `~/.claude/tasks/{team-name}/`

## Attribution

Content adapted from [Orchestrate teams of Claude Code sessions](https://code.claude.com/docs/en/agent-teams) (Anthropic documentation).
