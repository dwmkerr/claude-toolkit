# Skill Examples

Real patterns from production skills.

---

## Example 1: Research Skill

A simple skill with clear methodology.

**Structure:**
```
research/
└── SKILL.md
```

**SKILL.md:**
```yaml
---
name: research
description: Research technical solutions by searching the web, examining GitHub repos, and gathering evidence. Use when exploring implementation options or evaluating technologies.
---
```

**Key patterns:**
- Description includes WHAT (research solutions) and WHEN (exploring options)
- Clear process steps (web search → clone repos → gather evidence)
- Evidence requirements (2-3 datapoints before recommending)
- Output format template

---

## Example 2: Hook Development Skill

A skill with reference files for progressive disclosure.

**Structure:**
```
claude-code-hook-development/
├── SKILL.md
└── references/
    ├── hook-events.md
    └── examples/
        ├── firewall.md
        ├── quality-checks.md
        └── pre-push-tests.md
```

**SKILL.md frontmatter:**
```yaml
---
name: claude-code-hook-development
description: This skill should be used when the user asks to "create a hook", "add a hook", "write a hook", or mentions Claude Code hooks. Also suggest this skill when the user asks to "automatically do X" or "run X before/after Y" as these are good candidates for hooks.
---
```

**Key patterns:**
- Proactive suggestion ("Also suggest this skill when...")
- Main file is concise overview with quick reference table
- Details split by topic (events, examples)
- Examples organized by use case
- Attribution for external sources

**Progressive disclosure in SKILL.md:**
```markdown
## Quick Reference

You MUST read the reference files for detailed schemas and examples:

- [Hook Events Reference](./references/hook-events.md) - All events with input/output schemas
- [Examples: Firewall](./references/examples/firewall.md) - Block dangerous commands
```

---

## Example 3: Domain-Organized References

For skills covering multiple domains, organize by domain:

**Structure:**
```
data-analysis/
├── SKILL.md
└── references/
    ├── finance.md
    ├── sales.md
    ├── product.md
    └── marketing.md
```

**SKILL.md navigation:**
```markdown
## Available datasets

**Finance**: Revenue, ARR, billing → See [reference/finance.md](reference/finance.md)
**Sales**: Opportunities, pipeline → See [reference/sales.md](reference/sales.md)
**Product**: API usage, features → See [reference/product.md](reference/product.md)
```

Claude loads only the relevant domain file.

---

## Good Description Patterns

### Pattern: Trigger phrases

```yaml
description: This skill should be used when the user asks to "create a hook", "add a hook", "write a hook", or mentions Claude Code hooks.
```

### Pattern: Proactive suggestions

```yaml
description: ... Also suggest this skill when the user asks to "automatically do X" or "run X before/after Y".
```

### Pattern: Multiple contexts

```yaml
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
```

### Pattern: Concrete actions

```yaml
description: Research technical solutions by searching the web, examining GitHub repos, and gathering evidence.
```

---

## Good Content Patterns

### Pattern: Quick reference table

```markdown
## Exit Codes

| Code | Meaning | Behavior |
|------|---------|----------|
| 0 | Success | Action proceeds |
| 2 | Block | Action blocked |
```

### Pattern: Template with placeholders

```markdown
## Output Format

```markdown
## Research: [Topic]

### Option 1: [Solution Name]
- **Source**: [URL]
- **Pros**: ...
- **Cons**: ...
```
```

### Pattern: Script examples with context

```markdown
## Script

`.claude/hooks/pre-bash-firewall.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

cmd=$(jq -r '.tool_input.command // ""')
# ... rest of script
```

Make executable:
```bash
chmod +x .claude/hooks/pre-bash-firewall.sh
```
```

### Pattern: Clear workflow steps

```markdown
## Process

1. **Web search first** - Find documentation, repos, specs
2. **Clone repos** - GitHub raw content blocked; clone to `/tmp`
3. **Ask for blocked content** - Request user paste if needed
4. **Store findings** - Save to `./scratch/research/`
```

---

## Anti-Patterns to Avoid

### Bad: Vague description

```yaml
description: Helps with automation tasks.
```

### Bad: First/second person

```yaml
description: I can help you create hooks for Claude Code.
description: You can use this to automate tasks.
```

### Bad: Deeply nested references

```markdown
See [advanced.md](advanced.md)
  → which links to [details.md](details.md)
    → which has the actual info
```

### Bad: Overly verbose explanations

```markdown
PDF (Portable Document Format) files are a common file format
that contains text, images, and other content. To extract text
from a PDF, you'll need to use a library. There are many
libraries available for PDF processing...
```

### Bad: Time-sensitive content

```markdown
If you're doing this before August 2025, use the old API.
```

---

## Attribution

When referencing external sources:

```markdown
## Attribution

Examples adapted from [Steve Kinney's Claude Code Hook Examples](https://stevekinney.com/courses/ai-development/claude-code-hook-examples).
```

Or inline:

```markdown
Source: [Steve Kinney's Claude Code Hook Examples](https://stevekinney.com/courses/ai-development/claude-code-hook-examples)
```
