# Worked examples

Real, end-to-end applications of the solve-problem moves. Each is a full trace —
symptom, hypotheses, discriminating evidence, root cause, fix, verification — kept
so a future reader can see the method applied to a hard, real problem rather than a
toy.

When you are working a genuinely confusing problem and want a model to follow, read
the example whose lesson matches your situation.

| Example | Domain | Core lesson |
|---------|--------|-------------|
| [SSE keepalive misdiagnosed as a timeout](example-sse-keepalive-misdiagnosed-as-timeout.md) | Code / distributed systems | The label in the bug report ("timeout") is a hypothesis, not evidence. Exact-constant timing means a deadline/interval, not work. When cheap checks don't isolate it, change the *conditions* to expose the hidden variable. Library source is evidence. |
| [A skill hidden by its frontmatter](example-skill-hidden-by-frontmatter.md) | Tooling / config | The fix was in the definition (frontmatter `user_invocable: false`), not the surfaces (menu label, cache error). Surface signals are hypotheses. Don't declare "fixed" on a proxy signal — a secondary error clearing is not the reported symptom clearing; a symptom can have two causes. |

## What makes a good worked example here

- It shows at least one **wrong-but-plausible** hypothesis being **falsified** by a
  test, not just the winning one being confirmed.
- It shows the moment the investigation **escalated instrumentation** because the
  cheap checks didn't separate the candidates.
- It states **confidence** and what remained uncertain.
- It ends with the original symptom **re-observed gone** (move 6), not "a change
  was made".
