# Example: Conversational Agent Evaluation

Annotated walkthrough of a support agent eval for handling refunds.

## Task Context

A support agent must handle a refund for a frustrated customer. Success is multidimensional:
- Is the ticket resolved? (state check)
- Did it finish in <10 turns? (transcript constraint)
- Was the tone appropriate? (LLM rubric)

## Graders

### 1. LLM Rubric

```yaml
- type: llm_rubric
  rubric: prompts/support_quality.md
  assertions:
    - "Agent showed empathy for customer's frustration"
    - "Resolution was clearly explained"
    - "Agent's response grounded in fetch_policy tool results"
```

Natural language assertions evaluated by an LLM judge. Captures nuance that code can't.

**Key assertions:**
- **Empathy**: Emotional intelligence check
- **Clarity**: Communication quality
- **Grounding**: Used tools appropriately, didn't hallucinate policy

### 2. State Check

```yaml
- type: state_check
  expect:
    tickets: {status: resolved}
    refunds: {status: processed}
```

Verify actual outcomes in the environment:
- Ticket marked resolved in system
- Refund actually processed (not just promised)

### 3. Tool Calls Verification

```yaml
- type: tool_calls
  required:
    - {tool: verify_identity}
    - {tool: process_refund, params: {amount: "<=100"}}
    - {tool: send_confirmation}
```

Verify required workflow steps:
- Identity verified before refund
- Refund within authorized limit
- Confirmation sent to customer

### 4. Transcript Constraints

```yaml
- type: transcript
  max_turns: 10
```

Efficiency constraint - agent should resolve quickly, not drag out conversation.

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

## Simulated Users

Conversational evals often require a second LLM to simulate the user:

```yaml
user_simulation:
  persona: "Frustrated customer, purchased item 3 days ago, item arrived damaged"
  style: "Initially upset, responds to empathy, wants quick resolution"
```

This tests how the agent handles realistic interactions.

## Full Example

See [conversational-agent-eval.yaml](./conversational-agent-eval.yaml) for the complete template.

## Best Practices for Conversational Evals

1. **Model-based graders are primary** - Many "correct" solutions
2. **State checks verify real outcomes** - Not just conversation
3. **Transcript constraints ensure efficiency** - Max turns
4. **Use simulated users** - Second LLM with persona
5. **Multi-dimensional success** - Task completion AND interaction quality
6. **Calibrate with humans** - Ensure LLM judgments match expert opinion
