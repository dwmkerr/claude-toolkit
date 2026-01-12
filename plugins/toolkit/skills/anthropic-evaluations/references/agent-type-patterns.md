# Agent Type Patterns

Evaluation strategies for different agent types.

## Coding Agents

Write, test, and debug code. Navigate codebases and run commands.

**Primary graders:**
- Unit tests (deterministic, pass/fail)
- LLM rubric for code quality

**Key benchmarks:**
- [SWE-bench Verified](https://www.swebench.com/SWE-bench/) - GitHub issues, test suites
- [Terminal-Bench](https://www.tbench.ai/) - End-to-end technical tasks

**Evaluation approach:**
1. Well-specified tasks with clear success criteria
2. Stable test environments
3. Thorough tests for generated code
4. Optional: heuristics-based code quality rules
5. Optional: model-based graders for tool usage patterns

**Example graders:**
```yaml
graders:
  - type: deterministic_tests
    required: [test_feature.py, test_edge_cases.py]
  - type: llm_rubric
    rubric: prompts/code_quality.md
  - type: static_analysis
    commands: [ruff, mypy, bandit]
```

## Conversational Agents

Interact with users in support, sales, or coaching. Maintain state and take actions.

**Primary graders:**
- Model-based for communication quality
- State checks for outcomes
- Transcript constraints

**Key benchmarks:**
- [τ-Bench](https://arxiv.org/abs/2406.12045) - Multi-turn interactions
- [τ2-Bench](https://arxiv.org/abs/2506.07982) - Retail, airline scenarios

**Evaluation approach:**
1. Verifiable end-state outcomes
2. Rubrics for interaction quality
3. Second LLM to simulate user
4. Multidimensional success criteria

**Example graders:**
```yaml
graders:
  - type: llm_rubric
    rubric: prompts/support_quality.md
    assertions:
      - "Agent showed empathy"
      - "Resolution clearly explained"
  - type: state_check
    expect:
      tickets: {status: resolved}
  - type: transcript
    max_turns: 10
```

## Research Agents

Gather, synthesize, and analyze information. Produce reports or answers.

**Primary graders:**
- Groundedness checks (claims supported by sources)
- Coverage checks (key facts included)
- Source quality checks (authoritative sources)
- Exact match for objective answers

**Key benchmarks:**
- [BrowseComp](http://arxiv.org/abs/2504.12516) - Finding needles in haystacks across the web

**Evaluation approach:**
1. Combine multiple grader types
2. Frequent calibration against expert judgment
3. LLM flags unsupported claims and gaps
4. Verify synthesis coherence and completeness

**Challenges:**
- Experts may disagree on comprehensiveness
- Ground truth shifts as content changes
- Longer outputs = more room for mistakes

## Computer Use Agents

Interact through GUI (screenshots, clicks, keyboard) rather than APIs.

**Primary graders:**
- URL and page state checks
- Backend state verification
- File system inspection
- Application config checks

**Key benchmarks:**
- [WebArena](https://arxiv.org/abs/2307.13854) - Browser-based tasks
- [OSWorld](https://os-world.github.io/) - Full OS control

**Evaluation approach:**
1. Run agent in real or sandboxed environment
2. Check intended outcome achieved
3. Inspect diverse artifacts after completion
4. Balance token efficiency vs latency

**Token efficiency considerations:**
- DOM-based: Fast execution, many tokens
- Screenshot-based: Slower, more token-efficient
- Choose based on task (text extraction vs visual navigation)
