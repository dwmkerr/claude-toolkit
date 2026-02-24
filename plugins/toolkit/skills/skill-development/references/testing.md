# Testing Your Skill

Source: [The Complete Guide to Building Skills for Claude](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf) - Anthropic

---

## Testing Approaches

Choose the approach that matches your needs:

- **Manual testing in Claude.ai** — Run queries directly. Fast iteration, no setup.
- **Scripted testing with `claude -p`** — Automate test cases with bash scripts using headless mode.
- **MCP evaluation framework** — XML-based test harness for MCP-based skills ([anthropics/skills](https://github.com/anthropics/skills/blob/main/skills/mcp-builder/scripts/evaluation.py)).

There is no built-in skill unit test framework. Testing uses the CLI headless mode or custom harnesses.

**Pro tip:** Iterate on a single challenging task until Claude succeeds, then extract the winning approach into a skill. Expand to multiple test cases afterward.

---

## Three Test Dimensions

### 1. Triggering Tests

Does the skill load when it should?

**Test cases:**
- Triggers on obvious requests
- Triggers on paraphrased requests
- Does NOT trigger on unrelated topics

**Manual test:** Ask Claude "When would you use the [skill name] skill?" — it quotes the description back. Adjust based on what's missing.

**Scripted test:**
```bash
#!/bin/bash
# Test that skill triggers on expected prompts

should_trigger=(
  "Help me create a new skill"
  "I want to build a skill for code review"
  "Write a skill for deployment"
)

should_not_trigger=(
  "What's the weather today?"
  "Help me write a Python script"
  "Create a spreadsheet"
)

for prompt in "${should_trigger[@]}"; do
  result=$(claude -p "$prompt" --output-format json 2>/dev/null)
  # Check if response shows skill-specific behavior
  if echo "$result" | jq -r '.result' | grep -qi "skill\|SKILL.md\|frontmatter"; then
    echo "✅ Triggered: $prompt"
  else
    echo "❌ Did not trigger: $prompt"
  fi
done

for prompt in "${should_not_trigger[@]}"; do
  result=$(claude -p "$prompt" --output-format json 2>/dev/null)
  if echo "$result" | jq -r '.result' | grep -qi "skill\|SKILL.md\|frontmatter"; then
    echo "❌ False trigger: $prompt"
  else
    echo "✅ Correctly ignored: $prompt"
  fi
done
```

### 2. Functional Tests

Does the skill produce correct outputs?

**Scripted test with `claude -p`:**
```bash
#!/bin/bash
# Functional test: verify skill output contains expected elements

result=$(claude -p "Create a skill called 'my-test-skill' that helps with code review" \
  --output-format json \
  --allowedTools "Read,Write,Edit" 2>/dev/null)

output=$(echo "$result" | jq -r '.result')

# Check expected elements in output
pass=true
for expected in "name: my-test-skill" "description:" "SKILL.md"; do
  if echo "$output" | grep -q "$expected"; then
    echo "✅ Contains: $expected"
  else
    echo "❌ Missing: $expected"
    pass=false
  fi
done

$pass && echo "Test passed" || echo "Test failed"
```

**Structured output test (verify specific fields):**
```bash
schema='{"type":"object","properties":{"has_frontmatter":{"type":"boolean"},"has_description":{"type":"boolean"}},"required":["has_frontmatter","has_description"]}'

result=$(claude -p "Analyze this SKILL.md and report if it has valid frontmatter and description" \
  --output-format json \
  --json-schema "$schema" 2>/dev/null)

has_frontmatter=$(echo "$result" | jq '.structured_output.has_frontmatter')
has_description=$(echo "$result" | jq '.structured_output.has_description')

[[ "$has_frontmatter" == "true" ]] && echo "✅ Frontmatter valid" || echo "❌ Frontmatter missing"
[[ "$has_description" == "true" ]] && echo "✅ Description valid" || echo "❌ Description missing"
```

**Multi-turn test (verify conversation continuity):**
```bash
# First turn: set up context
session=$(claude -p "I want to create a skill for database migrations" \
  --output-format json 2>/dev/null | jq -r '.session_id')

# Second turn: verify skill remembers context
result=$(claude -p "What category should this skill be?" \
  --resume "$session" \
  --output-format json 2>/dev/null | jq -r '.result')

if echo "$result" | grep -qi "workflow"; then
  echo "✅ Context preserved across turns"
else
  echo "❌ Context lost"
fi
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

You can measure token usage from the JSON output:
```bash
result=$(claude -p "Test prompt" --output-format json 2>/dev/null)
echo "$result" | jq '{
  input_tokens: .usage.input_tokens,
  output_tokens: .usage.output_tokens,
  total: (.usage.input_tokens + .usage.output_tokens)
}'
```

---

## MCP Evaluation Framework

For skills that use MCP tools, the `anthropics/skills` repo includes a production-ready evaluation script.

**Test case format** (`evaluation.xml`):
```xml
<evaluation>
  <qa_pair>
    <question>Find the project with highest tasks. What is the project name?</question>
    <answer>Website Redesign</answer>
  </qa_pair>
  <qa_pair>
    <question>Search for issues labeled "bug" closed in March. Which user closed the most?</question>
    <answer>sarah_dev</answer>
  </qa_pair>
</evaluation>
```

**Run evaluation:**
```bash
pip install anthropic mcp
export ANTHROPIC_API_KEY=your_key

python scripts/evaluation.py \
  -t stdio -c python -a my_server.py evaluation.xml
```

**Output:** Accuracy score, tool call metrics, per-question pass/fail, detailed markdown report.

Source: [anthropics/skills evaluation.py](https://github.com/anthropics/skills/blob/main/skills/mcp-builder/scripts/evaluation.py)

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
