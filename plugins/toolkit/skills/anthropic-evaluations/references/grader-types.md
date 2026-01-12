# Grader Types

Agent evaluations combine three types of graders. Choose the right graders for each task.

## Code-Based Graders

Fast, cheap, objective, reproducible.

| Method | Description |
|--------|-------------|
| String match | Exact, regex, or fuzzy matching |
| Binary tests | fail-to-pass, pass-to-pass |
| Static analysis | Lint, type checking, security (ruff, mypy, bandit) |
| Outcome verification | Check final state in environment |
| Tool calls verification | Verify tools used and parameters |
| Transcript analysis | Turns taken, token usage |

**Strengths:**
- Fast and cheap
- Objective and reproducible
- Easy to debug
- Verify specific conditions

**Weaknesses:**
- Brittle to valid variations
- Lacking in nuance
- Limited for subjective tasks

## Model-Based Graders

Flexible, scalable, captures nuance.

| Method | Description |
|--------|-------------|
| Rubric-based scoring | Grade against defined criteria |
| Natural language assertions | "Agent showed empathy" |
| Pairwise comparison | Compare two outputs |
| Reference-based evaluation | Compare to gold standard |
| Multi-judge consensus | Multiple LLMs vote |

**Strengths:**
- Flexible and scalable
- Captures nuance
- Handles open-ended tasks
- Handles freeform output

**Weaknesses:**
- Non-deterministic
- More expensive than code
- Requires calibration with human graders

## Human Graders

Gold standard quality, matches expert judgment.

| Method | Description |
|--------|-------------|
| SME review | Subject matter expert evaluation |
| Crowdsourced judgment | Multiple human raters |
| Spot-check sampling | Random sample review |
| A/B testing | Compare variants with users |
| Inter-annotator agreement | Measure rater consistency |

**Strengths:**
- Gold standard quality
- Matches expert user judgment
- Used to calibrate model-based graders

**Weaknesses:**
- Expensive and slow
- Often requires access to human experts at scale

## Scoring Strategies

For each task, scoring can be:

| Strategy | Description |
|----------|-------------|
| **Weighted** | Combined grader scores must hit threshold |
| **Binary** | All graders must pass |
| **Hybrid** | Mix of weighted and binary |

## Best Practices

1. **Choose deterministic graders where possible** - Code-based for clear pass/fail
2. **Use LLM graders where necessary** - For nuance and flexibility
3. **Use human graders judiciously** - For calibration and validation
4. **Build in partial credit** - Represent continuum of success
5. **Grade outcomes, not paths** - Don't punish creative solutions
6. **Give LLM judges an "Unknown" option** - Avoid hallucinations

## Calibrating Model-Based Graders

LLM-as-judge graders should be closely calibrated with human experts:

1. Create structured rubrics for each dimension
2. Grade each dimension with isolated LLM judge
3. Periodically compare with human grading
4. Adjust prompts/rubrics when divergence detected

Once robust, human review only needed occasionally.
