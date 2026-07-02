---
name: solve-problem
description: This skill should be used when the user says "solve problem", "solve this problem", or invokes /solve-problem. Applies a methodical, evidence-first approach to diagnosing a problem - understand intent, observe the problem first-hand, form multiple hypotheses, gather discriminating evidence to eliminate them, propose an evidenced solution, and verify the fix actually resolves the original symptom. Do NOT use for general how-to questions, explanations, or building new features.
allowed-tools: Read, Grep, Bash
---

# Solve Problem

A methodical approach to solving a problem. The goal is to resist the instinct to
jump at the first plausible-sounding fix. That instinct feels fast but causes
wrong fixes and wasted iteration. Slow down, gather evidence, then propose.

Work through the moves in order. Do not skip ahead. The moves are
domain-neutral — they apply to a code bug, a broken appliance, a drop in sales,
or a failing process. Examples below span more than code on purpose.

## 1. Understand intent

Restate the problem in your own words so the user can correct you. Establish what
they expect, what is actually happening, and what "solved" looks like.

Clarify with the user **only if the problem is genuinely ambiguous**. Do not
interrogate a clear problem — echo your understanding and move on.

## 2. See the problem — first-hand, repeatably

Confirm the problem is real before hunting for causes. **Observe it directly,
under conditions you can return to** — don't diagnose from a second-hand report,
ticket, summary, or a single stale log line. You want a way to make the problem
happen (or to check whether it's happening) **again on demand**, because the same
handle confirms the cause now and verifies the fix later (move 6).

Prefer first-hand evidence over artifacts: reproduce the bug by running it; watch
the real checkout instead of reading the sales dashboard; measure the actual part
instead of trusting the spec.

If you cannot see it, or it turns out not to be a real problem (wrong expectation,
already fixed, environment issue), **say so and stop**. Do not invent a fix for a
problem you have not observed.

## 3. Hypothesize

Once the problem is confirmed, investigate how the thing is *supposed* to work and
where reality diverges. From that investigation, list **at least two** candidate
causes.

A single hypothesis is banned — it leads to tunnel vision. Force yourself to name
alternatives, even ones you think are unlikely.

## 4. Gather evidence

For each hypothesis, run the cheapest check that *discriminates* between causes —
ideally one that could prove the hypothesis **wrong**, not merely one consistent
with it. Evidence that merely *fits* a hypothesis (correlation) is weak: it often
fits competing hypotheses too. ("It works in a clean browser" is consistent with
*both* "stale state" and "a race" — it rules out neither.) Seek the check that
*separates* them.

Confirm or eliminate each with first-hand evidence. Assumptions and memory are not
evidence. If the cheap checks (logs, reports) don't isolate it, **escalate to
direct observation with more instrumentation** rather than guessing harder. Keep
eliminating until one cause is supported by evidence that survived an attempt to
falsify it.

## 5. Propose

Propose a solution grounded in the evidence. State your **confidence level** and
**what is still uncertain**. If you cannot reach certainty, say so, and say what
would resolve it.

By default, stop here. Propose — do not implement — unless the user asks you to
apply the fix.

## 6. Verify the resolution

Once a fix is applied, **re-observe the original symptom under the same conditions
that showed it** (move 2's handle). The problem is not solved until the thing that
was wrong is now demonstrably right — observed, not assumed.

This is **not** the same as move 4. Move 4 verifies the *diagnosis* ("is this the
cause?"); move 6 verifies the *resolution* ("did my action make the symptom
actually go away?"). They are different questions: a doctor's test can confirm the
cause, yet the prescribed treatment may still not cure the patient — you check the
patient got better. You can also mis-apply a *correct* diagnosis (incomplete fix,
wrong change, a side effect), and only re-observing the symptom catches that.

If the symptom persists, the fix — or the diagnosis behind it — was wrong. Do not
patch again from the same reasoning; return to move 2 with more instrumentation.

Re-observe the **exact symptom the user reported — not a proxy.** A related error
clearing or a secondary signal going green is not the symptom going away. One cause
cleared is not the symptom cleared; if it persists, another cause remains — return
to observing.

## Anti-rush rules

- **Read the definition before the surroundings.** When something misbehaves, the
  artifact that *defines* it — its config, frontmatter, schema, or source — is
  usually the cheapest, most decisive evidence. Read it before theorizing from
  menus, labels, dashboards, or error text, which are downstream surfaces.
- No proposal before the problem is **seen first-hand** and a cause is **evidenced**.
- At least two hypotheses before testing any.
- Evidence — not memory or assumption — confirms a cause. Prefer a check that could
  *falsify* the hypothesis over one that merely fits it.
- **Recurrence means you were wrong.** If the problem comes back after a fix, the
  cause (or the fix) was wrong — go back to observing it directly with more
  instrumentation; do **not** propose another fix from the same reasoning.
- **The words in the report are hypotheses, not evidence.** "It's a timeout," "it's
  a race," "it only happens without X" — these are the reporter's model of the bug,
  often wrong even when plausible. Test them like any other hypothesis; never adopt
  them as the starting fact.
- **Surface signals are hypotheses too.** A menu label, status badge, error string,
  or dashboard number is the system's *rendering* of its state, not the state
  itself. Confirm against the underlying definition/source, not the surface.
- **A constant is a clue.** An exact, repeating number (the same 15s three times)
  is a deadline or an interval, not how long the work took — work varies, limits
  don't. When cheap checks can't separate causes, **change the conditions** to make
  a hidden variable visible rather than staring harder at the same setup.
- Not solved until **re-observed gone** (move 6), not just "a change was made".
- State confidence. Flag uncertainty. Never fake certainty.

## Show your working

When presenting the proposal, always show the full trace so the user can debug your
reasoning. Use this structure:

```
## Problem
<the problem, restated>

## How I confirmed it
<what you reproduced or observed — the evidence it is real>

## Hypotheses considered
1. <hypothesis> — <eliminated / confirmed>
2. <hypothesis> — <eliminated / confirmed>
...

## Evidence
<per hypothesis: what you checked and what it showed>

## Root cause
<the cause supported by evidence>

## Proposed solution
<the fix, grounded in the evidence>

## Confidence
<high / medium / low> — <what is still uncertain, if anything>

## Verification (after applying)
<the original symptom re-checked under the same conditions — gone, observed>
```

## Worked examples

For full end-to-end traces of the method applied to hard, real problems, see
[`references/`](references/README.md). Read one when you are stuck and want a model
to follow. Currently:

- [SSE keepalive misdiagnosed as a timeout](references/example-sse-keepalive-misdiagnosed-as-timeout.md)
  — a bug *reported* as a "query timeout" that was nothing of the kind. Shows
  falsifying several plausible causes, escalating instrumentation (throttling a
  consumer to expose a hidden keepalive), reading dependency source as evidence,
  and verifying the fix end-to-end.
