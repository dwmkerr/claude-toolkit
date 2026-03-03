# Agent Teams Complete Guide

Full reference for orchestrating teams of Claude Code sessions.

Source: [Orchestrate teams of Claude Code sessions](https://code.claude.com/docs/en/agent-teams)

## Use Case Examples

### Parallel Code Review

Split review criteria into independent domains so security, performance, and test coverage all get thorough attention simultaneously:

```text
Create an agent team to review PR #142. Spawn three reviewers:
- One focused on security implications
- One checking performance impact
- One validating test coverage
Have them each review and report findings.
```

Each reviewer applies a different filter. The lead synthesizes findings.

### Competing Hypotheses Investigation

When the root cause is unclear, avoid anchoring bias by making teammates adversarial:

```text
Users report the app exits after one message instead of staying connected.
Spawn 5 agent teammates to investigate different hypotheses. Have them talk to
each other to try to disprove each other's theories, like a scientific
debate. Update the findings doc with whatever consensus emerges.
```

The debate structure ensures the theory that survives is more likely to be the actual root cause.

## Architecture Details

### How Teams Start

Two paths:
1. **You request a team** — describe the task and team structure, Claude creates it
2. **Claude proposes a team** — Claude suggests a team if your task would benefit, you confirm

Claude won't create a team without your approval.

### Components

| Component | Role |
|-----------|------|
| Team lead | Main Claude Code session; creates team, spawns teammates, coordinates |
| Teammates | Separate Claude Code instances; each works on assigned tasks |
| Task list | Shared list of work items; teammates claim and complete |
| Mailbox | Messaging system for direct communication between agents |

### Storage

- Team config: `~/.claude/teams/{team-name}/config.json`
- Task list: `~/.claude/tasks/{team-name}/`

The team config contains a `members` array with each teammate's name, agent ID, and agent type. Teammates read this to discover other members.

### Permissions

Teammates start with the lead's permission settings. If the lead uses `--dangerously-skip-permissions`, all teammates do too. Individual modes can be changed after spawning but not at spawn time.

### Context and Communication

Each teammate loads the same project context as a regular session (CLAUDE.md, MCP servers, skills) plus the spawn prompt from the lead. The lead's conversation history does NOT carry over.

**Communication mechanisms:**
- **Automatic message delivery** — messages delivered automatically to recipients
- **Idle notifications** — teammates notify the lead when they finish
- **Shared task list** — all agents see task status and claim available work

**Messaging types:**
- `message` — send to one specific teammate
- `broadcast` — send to all teammates (use sparingly, costs scale with team size)

### Task Dependencies

The system manages dependencies automatically. When a teammate completes a task that others depend on, blocked tasks unblock without manual intervention. Task claiming uses file locking to prevent race conditions.

## Display Modes

### In-Process Mode

All teammates run inside the main terminal.

- **Shift+Down** — cycle through teammates
- **Enter** — view a teammate's session
- **Escape** — interrupt their current turn
- **Ctrl+T** — toggle the task list

Works in any terminal, no extra setup.

### Split-Pane Mode

Each teammate gets its own pane. Requires tmux or iTerm2.

**tmux**: install via package manager. See [tmux wiki](https://github.com/tmux/tmux/wiki/Installing).

**iTerm2**: install the [`it2` CLI](https://github.com/mkusaka/it2), then enable Python API in iTerm2 Settings > General > Magic > Enable Python API.

Note: `tmux` works best on macOS. Using `tmux -CC` in iTerm2 is the suggested entrypoint.

### Configuration

Default is `"auto"` — uses split panes if already in tmux, otherwise in-process.

```json
{
  "teammateMode": "in-process"
}
```

Per-session override:

```bash
claude --teammate-mode in-process
```

## Controlling Teams

### Specify Teammates and Models

```text
Create a team with 4 teammates to refactor these modules in parallel.
Use Sonnet for each teammate.
```

### Plan Approval

For complex or risky tasks, require teammates to plan before implementing:

```text
Spawn an architect teammate to refactor the authentication module.
Require plan approval before they make any changes.
```

When a teammate finishes planning, it sends a plan approval request to the lead. The lead reviews and either approves or rejects with feedback. Rejected teammates revise and resubmit.

Influence the lead's judgment with criteria: "only approve plans that include test coverage" or "reject plans that modify the database schema."

### Direct Teammate Interaction

Each teammate is a full independent Claude Code session. Message any teammate directly.

### Task Assignment

The lead creates tasks, teammates work through them. Tasks have three states: pending, in progress, completed. Tasks can depend on other tasks.

- **Lead assigns** — tell the lead which task to give to which teammate
- **Self-claim** — after finishing, a teammate picks up the next unassigned, unblocked task

### Shutting Down

```text
Ask the researcher teammate to shut down
```

The teammate can approve (exits gracefully) or reject with explanation.

### Cleanup

```text
Clean up the team
```

Checks for active teammates and fails if any are still running. Shut them down first. Always use the lead to clean up — teammates should not run cleanup.

## Quality Gates with Hooks

### TeammateIdle

Runs when a teammate is about to go idle. Exit code 2 sends feedback and keeps the teammate working.

### TaskCompleted

Runs when a task is being marked complete. Exit code 2 prevents completion and sends feedback.

## Token Usage

Each teammate has its own context window. Token usage scales linearly with active teammates. For research, review, and new feature work, the extra tokens are usually worthwhile. For routine tasks, a single session is more cost-effective.

## Best Practices

### Give Enough Context

Include task-specific details in the spawn prompt since teammates don't inherit conversation history:

```text
Spawn a security reviewer teammate with the prompt: "Review the authentication module
at src/auth/ for security vulnerabilities. Focus on token handling, session
management, and input validation. The app uses JWT tokens stored in
httpOnly cookies. Report any issues with severity ratings."
```

### Team Sizing

- Start with 3-5 teammates
- 5-6 tasks per teammate keeps everyone productive
- Three focused teammates often outperform five scattered ones
- Scale up only when the work genuinely benefits

### Task Sizing

- **Too small** — coordination overhead exceeds the benefit
- **Too large** — teammates work too long without check-ins
- **Just right** — self-contained units that produce a clear deliverable (a function, a test file, a review)

### Other Tips

- If the lead starts implementing instead of waiting, tell it: "Wait for your teammates to complete their tasks before proceeding"
- Avoid file conflicts — break work so each teammate owns different files
- Monitor and steer — don't let a team run unattended too long
- Start with research and review tasks before trying parallel implementation

## Troubleshooting

### Teammates Not Appearing

- In-process mode: press Shift+Down to cycle through active teammates
- Check task complexity — Claude decides whether to spawn based on the task
- For split panes: verify `which tmux` returns a path
- For iTerm2: verify `it2` CLI installed and Python API enabled

### Too Many Permission Prompts

Pre-approve common operations in permission settings before spawning teammates.

### Teammates Stopping on Errors

Check output via Shift+Down (in-process) or click pane (split mode). Give additional instructions or spawn a replacement.

### Lead Shuts Down Early

Tell it to keep going or to wait for teammates to finish before proceeding.

### Orphaned tmux Sessions

```bash
tmux ls
tmux kill-session -t <session-name>
```

## Limitations

- No session resumption for in-process teammates (`/resume`, `/rewind` don't restore them)
- Task status can lag — check and update manually if stuck
- Shutdown can be slow (teammates finish current request first)
- One team per session
- No nested teams
- Lead is fixed for the team's lifetime
- Permissions set at spawn (change individually after)
- Split panes not supported in VS Code terminal, Windows Terminal, or Ghostty
- CLAUDE.md works normally — teammates read it from their working directory

## Related Approaches

- **Subagents** — lightweight delegation within a session, no inter-agent coordination
- **Git worktrees** — manual parallel sessions without automated team coordination
- **Feature comparison** — see [subagent vs agent team comparison](https://code.claude.com/docs/en/features-overview#compare-similar-features)
