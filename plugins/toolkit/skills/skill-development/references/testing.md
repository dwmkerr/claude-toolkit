# Testing Your Skill

Source: [The Complete Guide to Building Skills for Claude](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf) - Anthropic

---

## Testing Approaches

Choose the approach that matches your needs:

- **Manual testing in Claude.ai** — Run queries directly. Fast iteration, no setup.
- **Scripted testing in Claude Code** — Automate test cases for repeatable validation.
- **Programmatic testing via skills API** — Systematic evaluation suites at scale.

**Pro tip:** Iterate on a single challenging task until Claude succeeds, then extract the winning approach into a skill. Expand to multiple test cases afterward.

---

## Three Test Dimensions

### 1. Triggering Tests

Does the skill load when it should?

**Test cases:**
- Triggers on obvious requests
- Triggers on paraphrased requests
- Does NOT trigger on unrelated topics

**Example test suite:**
```
Should trigger:
- "Help me set up a new ProjectHub workspace"
- "I need to create a project in ProjectHub"
- "Initialize a ProjectHub project for Q4 planning"

Should NOT trigger:
- "What's the weather in San Francisco?"
- "Help me write Python code"
- "Create a spreadsheet"
```

**Debugging:** Ask Claude "When would you use the [skill name] skill?" — it will quote the description back. Adjust based on what's missing.

### 2. Functional Tests

Does the skill produce correct outputs?

**Test cases:**
- Valid outputs generated
- API calls succeed
- Error handling works
- Edge cases covered

**Example:**
```
Test: Create project with 5 tasks
Given: Project name "Q4 Planning", 5 task descriptions
When: Skill executes workflow
Then:
  - Project created
  - 5 tasks created with correct properties
  - All tasks linked to project
  - No API errors
```

### 3. Performance Comparison

Is the skill actually better than no skill?

**Compare with and without:**
```
Without skill:
- 15 back-and-forth messages
- 3 failed API calls requiring retry
- 12,000 tokens consumed

With skill:
- 2 clarifying questions only
- 0 failed API calls
- 6,000 tokens consumed
```

---

## Success Criteria

### Quantitative (aspirational targets)

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Trigger accuracy | ~90% | Run 10-20 test queries, track auto-loading rate |
| Tool call efficiency | Fewer calls than baseline | Compare same task with/without skill |
| API error rate | 0 per workflow | Monitor MCP server logs during tests |

### Qualitative

| Metric | How to Assess |
|--------|---------------|
| No prompting needed for next steps | Note how often you redirect or clarify during testing |
| Workflows complete without correction | Run same request 3-5 times, compare outputs |
| Consistent across sessions | Can a new user accomplish the task on first try? |

---

## Iteration Signals

### Undertriggering

**Signals:** Skill doesn't load when it should. Users manually enabling it.

**Fix:** Add more detail and keywords to the description, especially technical terms.

### Overtriggering

**Signals:** Skill loads for irrelevant queries. Users disabling it.

**Fix:** Add negative triggers, narrow the scope:
```yaml
description: Advanced data analysis for CSV files. Use for statistical
modeling, regression, clustering. Do NOT use for simple data exploration.
```

### Execution Issues

**Signals:** Inconsistent results. API failures. User corrections needed.

**Fix:** Improve instructions (concise bullet points), add error handling, consider validation scripts.
