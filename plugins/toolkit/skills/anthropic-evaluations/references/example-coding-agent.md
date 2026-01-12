# Example: Coding Agent Evaluation

Annotated walkthrough of a coding agent eval for fixing an authentication vulnerability.

## Task Definition

```yaml
task:
  id: "fix-auth-bypass_1"
  desc: "Fix authentication bypass when password field is empty"
```

- **id**: Unique identifier for the task
- **desc**: Clear description of what needs to be fixed

## Graders

### 1. Deterministic Tests

```yaml
- type: deterministic_tests
  required: [test_empty_pw_rejected.py, test_null_pw_rejected.py]
```

Unit tests that must pass. Binary pass/fail - the core verification that the bug is fixed.

### 2. LLM Rubric

```yaml
- type: llm_rubric
  rubric: prompts/code_quality.md
```

Model-based grader evaluates code quality against a rubric. Catches issues tests might miss (readability, maintainability).

### 3. Static Analysis

```yaml
- type: static_analysis
  commands: [ruff, mypy, bandit]
```

Run linters and security scanners:
- **ruff**: Python linting
- **mypy**: Type checking
- **bandit**: Security vulnerability scanning

### 4. State Check

```yaml
- type: state_check
  expect:
    security_logs: {event_type: "auth_blocked"}
```

Verify the outcome in the environment - not just that tests pass, but that the security event was logged.

### 5. Tool Calls Verification

```yaml
- type: tool_calls
  required:
    - {tool: read_file, params: {path: "src/auth/*"}}
    - {tool: edit_file}
    - {tool: run_tests}
```

Verify the agent used expected tools. Use sparingly - don't punish creative solutions.

## Tracked Metrics

```yaml
tracked_metrics:
  - type: transcript
    metrics:
      - n_turns
      - n_toolcalls
      - n_total_tokens
  - type: latency
    metrics:
      - time_to_first_token
      - output_tokens_per_sec
      - time_to_last_token
```

Track efficiency metrics for optimization and regression detection.

## Full Example

See [coding-agent-eval.yaml](./coding-agent-eval.yaml) for the complete template.

## Best Practices for Coding Evals

1. **Unit tests are primary** - Clear pass/fail signal
2. **Add LLM rubric for quality** - Beyond just "does it work"
3. **Static analysis catches issues** - Security, types, style
4. **State checks verify outcomes** - Not just agent's claims
5. **Tool call checks are optional** - Don't be too rigid
6. **Track metrics for baselines** - Latency, tokens, turns
