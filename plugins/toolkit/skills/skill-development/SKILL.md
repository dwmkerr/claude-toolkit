---
name: skill-development
description: This skill should be used when the user asks to "create a skill", "write a skill", "build a skill", or wants to develop a SKILL.md file. Use when developing SKILL.md files, organizing skill content, or improving existing skills. Do NOT use for plugin development, hook creation, agent creation, or slash command creation — those have dedicated skills.
allowed-tools: Read, Grep
---

# Skill Development

Create effective Claude Code skills that are concise, discoverable, and well-structured.

## Quick Reference

You MUST read these references for detailed guidance:

- [Best Practices](./references/best-practices.md) - Official Anthropic guidance
- [Skill Examples](./references/examples.md) - Patterns from real skills
- [Skill Categories & Patterns](./references/patterns.md) - Three categories and five reusable patterns
- [Testing Guide](./references/testing.md) - Triggering, functional, and performance testing
- [Troubleshooting](./references/troubleshooting.md) - Common problems and fixes
- [The Complete Guide to Building Skills for Claude](./references/complete-guide-to-building-skills.md) - Comprehensive Anthropic guide ([source PDF](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf))

## Before You Start

Define 2-3 concrete use cases before writing anything:

```
Use Case: [Name]
Trigger: User says "[phrase]" or "[phrase]"
Steps:
1. [First action]
2. [Second action]
Result: [What gets produced]
```

Then identify which category your skill falls into — this determines which techniques to use. See [Skill Categories & Patterns](./references/patterns.md).

## Core Principles

1. **Concise is key** - Only add context Claude doesn't already have
2. **Progressive disclosure** - SKILL.md is the overview; details go in `references/`
3. **Write in third person** - "This skill processes..." not "I can help you..."

## Skill Structure

```
skill-name/
├── SKILL.md              # Main instructions (< 500 lines)
├── scripts/              # Optional: executable code (Python, Bash, etc.)
├── assets/               # Optional: templates, fonts, icons
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
- `allowed-tools` - Restrict which tools the skill can use (e.g., `"Bash(python:*) Bash(npm:*) WebFetch"`). **Skills with `references/` directories should include `allowed-tools: Read, Grep`** to avoid permission prompts when accessing bundled files ([claude-code#15757](https://github.com/anthropics/claude-code/issues/15757))
- `license` - e.g., MIT, Apache-2.0
- `compatibility` - Environment requirements (1-500 chars)
- `metadata` - Custom key-value pairs (author, version, mcp-server)

## Writing Effective Descriptions

Structure: `[What it does] + [When to use it] + [Key capabilities]`

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

## Testing Your Skill

Validate across three dimensions before sharing:

1. **Triggering** - Does it load when it should? Not load when it shouldn't?
2. **Functional** - Does it produce correct outputs and handle errors?
3. **Performance** - Is it actually better than no skill? (fewer messages, fewer errors, less tokens)

See [Testing Guide](./references/testing.md) for test examples and success criteria.

## Troubleshooting

Common issues and fixes:

| Symptom | Fix |
|---------|-----|
| Doesn't trigger | Add specific trigger phrases to description |
| Triggers too often | Add negative triggers, narrow scope |
| Instructions ignored | Make instructions concise, use explicit headers |
| Slow responses | Move content to `references/`, reduce SKILL.md size |

See [Troubleshooting](./references/troubleshooting.md) for detailed solutions.

## Important

After creating or modifying skills, inform the user:

> **No restart needed.** Skill changes take effect immediately - skills are hot-reloaded.

## Checklist

Before finalizing a skill:

- [ ] 2-3 use cases defined with triggers, steps, and results
- [ ] Category identified (document creation, workflow automation, MCP enhancement)
- [ ] Description includes triggers ("when user asks to...")
- [ ] SKILL.md under 500 lines
- [ ] Complex content moved to `references/`
- [ ] Third person throughout
- [ ] No time-sensitive information
- [ ] Consistent terminology
- [ ] Triggering tests pass (obvious + paraphrased requests)
- [ ] Doesn't trigger on unrelated topics
