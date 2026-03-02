# CLAUDE.md

## Skill Tests

When adding or modifying skills, you MUST add or update the corresponding `skill-tests.yaml` file adjacent to the skill's `SKILL.md`. These tests verify that Claude routes prompts to the correct skill.

Example `plugins/toolkit/skills/<skill-name>/skill-tests.yaml`:

```yaml
skill: toolkit:<skill-name>
model: haiku

tests:
  - id: positive-test
    prompt: "a prompt that should trigger this skill"
    should_trigger: true

  - id: negative-test
    prompt: "a prompt that should not trigger this skill"
    should_trigger: false
```

Tests run in CI via the [skill-test-action](https://github.com/dwmkerr/skill-test-action).

When adding a new skill, also add an entry to `README.md` (both the TOC and the Skills section).

## Commands

Commands (slash commands) don't need skill tests — they're invoked explicitly, not routed by description. When adding a new command, add an entry to `README.md` (both the TOC and the Commands section under the relevant plugin).
