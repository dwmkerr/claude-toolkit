---
name: skill-development
description: This skill should be used when the user asks to "create a skill", "write a skill", "build a skill", or wants to add new capabilities to Claude Code. Use when developing SKILL.md files, organizing skill content, or improving existing skills.
---

# Skill Development

Create effective Claude Code skills that are concise, discoverable, and well-structured.

## Quick Reference

You MUST read these references for detailed guidance:

- [Best Practices](./references/best-practices.md) - Official Anthropic guidance
- [Skill Examples](./references/examples.md) - Patterns from real skills

## Core Principles

1. **Concise is key** - Only add context Claude doesn't already have
2. **Progressive disclosure** - SKILL.md is the overview; details go in `references/`
3. **Write in third person** - "This skill processes..." not "I can help you..."

## Skill Structure

```
skill-name/
├── SKILL.md              # Main instructions (< 500 lines)
└── references/           # Detailed docs (loaded on demand)
    ├── guide.md
    └── examples/
```

## YAML Frontmatter

```yaml
---
name: my-skill-name
description: This skill should be used when the user asks to "do X", "create Y", or mentions Z. Be specific about triggers.
context: fork          # Optional: run in isolated context (prevents side effects)
user-invocable: true   # Optional: show in slash command menu (default: true)
---
```

**Name rules:**
- Lowercase letters, numbers, hyphens only
- Max 64 characters
- No reserved words (anthropic, claude)

**Description rules:**
- Max 1024 characters
- Third person ("This skill..." not "I can...")
- Include WHAT it does AND WHEN to use it

**Optional fields:**
- `context: fork` - Run skill in isolated sub-agent context, preventing unintended side effects on main agent state
- `user-invocable: false` - Hide from slash command menu (skills are visible by default)

## Writing Effective Descriptions

Include trigger phrases the user might say:

```yaml
# Good - specific triggers
description: This skill should be used when the user asks to "create a hook", "add a hook", or mentions Claude Code hooks.

# Bad - vague
description: Helps with automation tasks.
```

## Progressive Disclosure Pattern

Keep SKILL.md under 500 lines. Link to details:

```markdown
# My Skill

## Quick start
[Essential info here]

## Advanced features
See [detailed-guide.md](./references/detailed-guide.md)

## API reference
See [api-reference.md](./references/api-reference.md)
```

Claude loads reference files only when needed.

## Hot Reload

Skills in `~/.claude/skills` or `.claude/skills` are hot-reloaded - changes take effect immediately without restarting Claude Code. This enables rapid iteration during development.

## Checklist

Before finalizing a skill:

- [ ] Description includes triggers ("when user asks to...")
- [ ] SKILL.md under 500 lines
- [ ] Complex content moved to `references/`
- [ ] Third person throughout
- [ ] No time-sensitive information
- [ ] Consistent terminology
