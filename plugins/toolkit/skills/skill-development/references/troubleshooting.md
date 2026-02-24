# Troubleshooting Skills

Source: [The Complete Guide to Building Skills for Claude](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf) - Anthropic

---

## Quick Reference

| Symptom | Likely Cause | Solution |
|---------|-------------|----------|
| Skill won't upload | SKILL.md not exact name | Rename to exactly `SKILL.md` (case-sensitive) |
| "Invalid frontmatter" | YAML formatting issue | Check `---` delimiters, unclosed quotes |
| "Invalid skill name" | Name has spaces or capitals | Use kebab-case: `my-cool-skill` |
| Skill doesn't trigger | Description too vague | Add specific trigger phrases |
| Skill triggers too often | Description too broad | Add negative triggers, narrow scope |
| MCP calls fail | Connection/auth issues | Verify MCP server, test independently |
| Instructions not followed | Too verbose or ambiguous | Concise bullet points, explicit headers |
| Slow/degraded responses | Too much content loaded | Move details to `references/`, reduce enabled skills |

---

## Detailed Solutions

### Skill Won't Upload

**"Could not find SKILL.md in uploaded folder"**

The file must be named exactly `SKILL.md` — case-sensitive. No variations (`SKILL.MD`, `skill.md`, `Skill.md`).

**"Invalid frontmatter"**

Common YAML mistakes:

```yaml
# Wrong - missing delimiters
name: my-skill
description: Does things

# Wrong - unclosed quotes
---
name: my-skill
description: "Does things
---

# Correct
---
name: my-skill
description: Does things
---
```

**"Invalid skill name"**

```yaml
# Wrong
name: My Cool Skill

# Correct
name: my-cool-skill
```

### Skill Doesn't Trigger

The description field is the trigger mechanism. Check:

- Is it too generic? ("Helps with projects" won't trigger reliably)
- Does it include phrases users would actually say?
- Does it mention relevant file types if applicable?

**Debugging approach:** Ask Claude "When would you use the [skill name] skill?" — it quotes the description back, revealing what's missing.

**Fix example:**
```yaml
# Before (too vague)
description: Processes documents

# After (specific triggers)
description: Processes PDF legal documents for contract review.
Use when user uploads .pdf files, asks for "contract review",
"legal analysis", or "document extraction".
```

### Skill Triggers Too Often

**Option 1: Add negative triggers**
```yaml
description: Advanced data analysis for CSV files. Use for
statistical modeling, regression, clustering. Do NOT use for
simple data exploration (use data-viz skill instead).
```

**Option 2: Narrow scope**
```yaml
# Before
description: Processes documents

# After
description: Processes PDF legal documents for contract review
```

**Option 3: Clarify scope**
```yaml
description: PayFlow payment processing for e-commerce. Use
specifically for online payment workflows, not for general
financial queries.
```

### MCP Connection Issues

Skill loads but MCP calls fail:

1. **Verify MCP server is connected** — Check Settings > Extensions
2. **Check authentication** — API keys valid, proper scopes, tokens refreshed
3. **Test MCP independently** — Ask Claude to call MCP directly without the skill ("Use [Service] MCP to fetch my projects"). If this fails, the issue is MCP, not the skill.
4. **Verify tool names** — Skill must reference correct MCP tool names (case-sensitive)

### Instructions Not Followed

**Too verbose** — Keep instructions concise. Use bullet points and numbered lists. Move detailed reference to separate files.

**Important content buried** — Put critical instructions at the top. Use `## Important` or `## Critical` headers.

**Ambiguous language:**
```markdown
# Bad
Make sure to validate things properly

# Good
CRITICAL: Before calling create_project, verify:
- Project name is non-empty
- At least one team member assigned
- Start date is not in the past
```

**Advanced technique:** For critical validations, bundle a script that performs checks programmatically. Code is deterministic; language interpretation isn't.

### Large Context Issues

Responses feel slow or degraded:

1. **Optimize SKILL.md size** — Move detailed docs to `references/`, keep SKILL.md under 500 lines
2. **Reduce enabled skills** — If more than 20-50 skills enabled simultaneously, consider selective enablement
3. **Check progressive disclosure** — Are you inlining content that should be in reference files?
