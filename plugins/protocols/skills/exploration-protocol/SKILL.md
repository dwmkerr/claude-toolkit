---
name: exploration-protocol
description: Structured approach to explore features before production development. Templates for objectives, acceptance criteria, architecture, prototypes, and verification. This skill should be used when the user asks to "explore a feature", "start an exploration", "create a task folder", or mentions exploration protocol.
user_invocable: true
---

# Exploration Protocol

A structured approach to explore features before production development. The goal is to learn, build acceptance criteria, experiment with verifiable prototypes, and codify learnings.

## Task Folder Structure

```
tasks/NNN-taskname/
├── 01-objectives.md
├── 02-acceptance-criteria.md
├── 03-architecture.md
├── 04-verifiable-prototype.md
├── 05-verification.md
├── 06-outcome.md
├── 99-research/
└── 99-findings/
```

## Document Templates

You MUST read the template files in `./references/001-example-task/` before scaffolding a task folder. These templates show the exact structure and format to use:

- [01-objectives.md](./references/001-example-task/01-objectives.md)
- [02-acceptance-criteria.md](./references/001-example-task/02-acceptance-criteria.md)
- [03-architecture.md](./references/001-example-task/03-architecture.md)
- [04-verifiable-prototype.md](./references/001-example-task/04-verifiable-prototype.md)
- [05-verification.md](./references/001-example-task/05-verification.md)
- [06-outcome.md](./references/001-example-task/06-outcome.md)

## Key Patterns

### Stub Markers

For sections to be filled in later:

```markdown
> Stub - to be filled in after objectives and acceptance criteria are approved.
```

### Criteria Tables

Always pair criteria with verification method:

```markdown
| Criterion | Verification Method |
|-----------|---------------------|
| User can log in | Manual test: complete flow, see logged-in state |
| API returns 401 on bad auth | `curl -H "Auth: bad"` shows 401 |
```

### Checkpoint Lists

For prototypes, use checkboxes:

```markdown
**Checkpoint 1:**
- [ ] Auth0 application configured
- [ ] PKCE enabled
```

### ASCII Diagrams

Keep simple:

```
┌─────────────┐     ┌─────────────┐
│   Popup     │────▶│  Background │────▶ API
└─────────────┘     └─────────────┘
```

## Phase Flow

1. **Objectives** → user reviews
2. **Acceptance Criteria** → user approves before work begins
3. **Architecture** → stub until criteria approved
4. **Prototype** → incremental with checkpoints
5. **Verification** → evidence for each criterion
6. **Outcome** → learnings and follow-on work
