# The Complete Guide to Building Skills for Claude

Source: [The Complete Guide to Building Skills for Claude](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf) - Anthropic (2026)

This reference summarizes the official Anthropic guide covering planning, design, testing, distribution, and troubleshooting of skills.

---

## Fundamentals

A skill is a folder containing:

- **SKILL.md** (required): Instructions in Markdown with YAML frontmatter
- **scripts/** (optional): Executable code (Python, Bash, etc.)
- **references/** (optional): Documentation loaded as needed
- **assets/** (optional): Templates, fonts, icons used in output

### Core Design Principles

**Progressive Disclosure** - Three-level system:

1. YAML frontmatter: Always in system prompt. Tells Claude *when* to use the skill.
2. SKILL.md body: Loaded when Claude thinks the skill is relevant. Full instructions.
3. Linked files: Navigated on demand as needed.

**Composability** - Skills work alongside other skills. Don't assume exclusivity.

**Portability** - Skills work across Claude.ai, Claude Code, and API without modification.

### Skills + MCP

MCP provides connectivity (tools, data access). Skills provide knowledge (workflows, best practices). Together they turn raw tool access into reliable workflows.

Without skills, users connect MCP but don't know what to do next. With skills, pre-built workflows activate automatically with consistent results.

---

## Planning and Design

### Start with Use Cases

Identify 2-3 concrete use cases before writing anything. Define each with:

- **Trigger**: What the user says
- **Steps**: The multi-step workflow
- **Result**: What gets produced

### Skill Use Case Categories

**Category 1: Document & Asset Creation** - Consistent output (documents, presentations, code). Uses embedded style guides, template structures, quality checklists. No external tools required.

**Category 2: Workflow Automation** - Multi-step processes with consistent methodology. Step-by-step workflow with validation gates, templates, iterative refinement loops.

**Category 3: MCP Enhancement** - Workflow guidance on top of MCP tool access. Coordinates multiple MCP calls, embeds domain expertise, provides context users would otherwise specify manually.

### Success Criteria

Quantitative:
- Skill triggers on 90% of relevant queries
- Completes workflow in target number of tool calls
- 0 failed API calls per workflow

Qualitative:
- Users don't need to prompt about next steps
- Workflows complete without user correction
- Consistent results across sessions

### Technical Requirements

**Critical rules:**

- SKILL.md must be exactly `SKILL.md` (case-sensitive)
- Folder names in kebab-case
- No README.md inside the skill folder
- No XML angle brackets in frontmatter (security restriction)
- No "claude" or "anthropic" in skill names (reserved)

**YAML frontmatter fields:**

| Field | Required | Notes |
|-------|----------|-------|
| name | Yes | kebab-case, no spaces/capitals, must match folder name |
| description | Yes | WHAT + WHEN, under 1024 chars, include trigger phrases |
| license | No | e.g., MIT, Apache-2.0 |
| compatibility | No | 1-500 chars, environment requirements |
| metadata | No | Custom key-value pairs (author, version, mcp-server) |

### Writing Effective Descriptions

Structure: `[What it does] + [When to use it] + [Key capabilities]`

Good examples:
```yaml
description: Analyzes Figma design files and generates developer handoff documentation. Use when user uploads .fig files, asks for "design specs", "component documentation", or "design-to-code handoff".
```

Bad examples:
```yaml
# Too vague
description: Helps with projects.

# Missing triggers
description: Creates sophisticated multi-page documentation systems.
```

### Writing Instructions

Recommended SKILL.md structure:
1. Step-by-step instructions with clear ordering
2. Examples showing common scenarios
3. Troubleshooting section for common errors

Best practices:
- Be specific and actionable (show exact commands, expected outputs)
- Include error handling
- Reference bundled resources clearly
- Use progressive disclosure (details in `references/`)

---

## Testing and Iteration

### Testing Approaches

- **Manual testing in Claude.ai** - Fast iteration, no setup required
- **Scripted testing in Claude Code** - Automated, repeatable validation
- **Programmatic testing via skills API** - Systematic evaluation suites

**Pro tip:** Iterate on a single challenging task until Claude succeeds, then extract the winning approach into a skill. Expand to multiple test cases afterward.

### Three Test Areas

**1. Triggering tests** - Verify the skill loads at the right times:
- Triggers on obvious tasks
- Triggers on paraphrased requests
- Doesn't trigger on unrelated topics

**2. Functional tests** - Verify correct outputs:
- Valid outputs generated
- API calls succeed
- Error handling works
- Edge cases covered

**3. Performance comparison** - Prove improvement vs. baseline:
- Fewer back-and-forth messages
- Fewer failed API calls
- Lower token consumption

### Iteration Signals

**Undertriggering:** Skill doesn't load when it should → Add more detail/keywords to description

**Overtriggering:** Skill loads for irrelevant queries → Add negative triggers, be more specific

**Execution issues:** Inconsistent results → Improve instructions, add error handling

---

## Distribution and Sharing

### Current Model

- Users download skill folder, zip it, upload to Claude.ai or place in Claude Code skills directory
- Organization admins can deploy skills workspace-wide
- Skills API available for programmatic use (`/v1/skills` endpoint)

### Skills as Open Standard

Skills are published as an open standard (like MCP). Portable across tools and platforms.

### Recommended Approach

1. Host on GitHub with clear README (repo-level, not in skill folder)
2. Document in your MCP repo, linking to skills
3. Create an installation guide
4. Focus positioning on outcomes, not features

---

## Patterns

### Problem-First vs. Tool-First

- **Problem-first:** User describes an outcome, skill orchestrates the right tools
- **Tool-first:** User has MCP connected, skill teaches optimal workflows

### Pattern 1: Sequential Workflow Orchestration

Multi-step processes in specific order. Explicit step ordering, dependencies between steps, validation at each stage, rollback instructions for failures.

### Pattern 2: Multi-MCP Coordination

Workflows spanning multiple services. Clear phase separation, data passing between MCPs, validation before moving to next phase.

### Pattern 3: Iterative Refinement

Output quality improves with iteration. Initial draft → quality check → refinement loop → finalization. Explicit quality criteria and "when to stop" conditions.

### Pattern 4: Context-Aware Tool Selection

Same outcome, different tools depending on context. Decision tree → execute → explain choice. Clear decision criteria and fallback options.

### Pattern 5: Domain-Specific Intelligence

Specialized knowledge beyond tool access. Compliance/validation checks before action, comprehensive audit trails.

---

## Troubleshooting

| Symptom | Common Cause | Solution |
|---------|-------------|----------|
| Skill won't upload | SKILL.md not exact name | Rename to exactly `SKILL.md` |
| Invalid frontmatter | Missing `---` delimiters or unclosed quotes | Fix YAML formatting |
| Skill doesn't trigger | Description too vague | Add specific trigger phrases |
| Skill triggers too often | Description too broad | Add negative triggers, narrow scope |
| MCP calls fail | Connection/auth issues | Verify MCP server connected, test independently |
| Instructions not followed | Too verbose or ambiguous | Concise bullet points, explicit critical instructions |
| Slow/degraded responses | Too much content loaded | Move details to `references/`, keep SKILL.md under 5,000 words |

### Advanced Technique

For critical validations, bundle a script that performs checks programmatically rather than relying on language instructions. Code is deterministic; language interpretation isn't.

---

## Quick Checklist

**Before starting:**
- [ ] 2-3 concrete use cases identified
- [ ] Tools identified (built-in or MCP)
- [ ] Folder structure planned

**During development:**
- [ ] Folder in kebab-case
- [ ] SKILL.md exists (exact spelling)
- [ ] YAML frontmatter with `---` delimiters
- [ ] Name field: kebab-case, no spaces/capitals
- [ ] Description includes WHAT and WHEN
- [ ] No XML tags anywhere
- [ ] Instructions clear and actionable
- [ ] Error handling included
- [ ] Examples provided

**Before sharing:**
- [ ] Triggering tests pass (obvious + paraphrased)
- [ ] Doesn't trigger on unrelated topics
- [ ] Functional tests pass
- [ ] Compressed as .zip for upload

**After sharing:**
- [ ] Monitor for under/over-triggering
- [ ] Collect user feedback
- [ ] Iterate on description and instructions
