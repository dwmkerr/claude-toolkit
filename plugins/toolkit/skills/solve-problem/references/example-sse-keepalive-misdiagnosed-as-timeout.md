# Worked example: an SSE keepalive bug reported as a "query timeout"

**Repo / proof point:** [dwmkerr/ark-demo](https://github.com/dwmkerr/ark-demo) ·
**Upstream bug + full trace:** [mckinsey/agents-at-scale-ark#1346](https://github.com/mckinsey/agents-at-scale-ark/issues/1346)
([root-cause comment](https://github.com/mckinsey/agents-at-scale-ark/issues/1346#issuecomment-4728271299))

A team reported that an AI agent platform (Ark) "fails on queries when streaming is
off" and called it a **query timeout**. The real cause was nothing to do with a
timeout. This is the canonical trap the skill exists to prevent: the word in the
report is a *hypothesis*, and an attractive one, but it is not evidence.

---

## 1. Understand intent

Restated: agents reply fine to short prompts, but a prompt that produces a **long**
answer fails with `unexpected end of JSON input` and the query ends in `error`.
Reporter framed it as "works with streaming, not without," and "feels like a
timeout." "Solved" = long answers complete reliably; cause understood, not guessed.

Note what was *not* accepted at face value: the label "timeout," and the
"streaming vs non-streaming" framing. Both are the reporter's model of the bug, to
be tested — not facts.

## 2. See the problem — first-hand, repeatably

Reproduced two independent ways, both giving a handle that fires on demand:

- **CLI:** created a `Query` resource directly against the agent with a
  long-answer prompt → `phase: error`, message `unexpected end of JSON input`.
- **UI:** drove the real dashboard chat with the same prompt → identical error.
  The browser network panel showed the client poll for **~15s**, then the query
  errored.

Short prompts always succeeded; long prompts always failed; failure always landed
at **~15 seconds**. That last fact — a *constant* — is the first real clue.

> Lesson: an exact, repeating constant (15s, three times, across two models) is
> almost never "how long the work took." It is a **deadline or an interval**. Work
> varies; deadlines don't.

## 3. Hypothesize (≥2, including unlikely ones)

1. The model endpoint truncates long streamed responses.
2. It's specific to one model/agent (the failing ones used a particular model).
3. A timeout somewhere in our code/config (the reporter's theory).
4. The pod's network egress (CNI/NAT) cuts the connection.
5. The HTTP/SDK client has a default request timeout.
6. Something in the *content* of the stream — not a timeout at all.

## 4. Gather evidence (cheapest *discriminating* check first; try to falsify)

- **Falsify (2):** ran the same long prompt against a *different* model/agent →
  also failed. Not model-specific. ✗
- **Falsify (1) and (4):** reproduced the exact streaming request with `curl`
  **from the host and from a pod in the cluster** (same egress path the service
  uses). Both streamed the full long answer in **~24s, HTTP 200, clean
  termination**. So the endpoint is fine and the network path is fine — and
  critically, the *full* response needs ~24s, but the service dies at ~15s. ✗✗
- **Falsify (3):** searched the entire codebase and every dependency in the
  request path for a 15s timeout. None existed; the only relevant timeout was 5
  minutes. ✗
- **Falsify (5):** read the HTTP client / SDK config — default request timeout was
  zero (disabled). ✗
- That left (6), but cheap checks hadn't *shown* it. **Escalate instrumentation by
  changing the conditions:** the service is a *slow* consumer (it forwards each
  chunk onward between reads), while `curl` drains instantly. So re-ran `curl` with
  the read **throttled** to mimic a slow consumer.

  The throttled stream revealed what the fast one never did — server keepalive
  frames, **exactly 15 seconds apart**:
  ```
  : ping - 2026-06-17 09:09:52
  : ping - 2026-06-17 09:10:07
  : ping - 2026-06-17 09:10:22
  ```
  Raw bytes showed each ping is an SSE **comment** line followed by a blank line.

- **Confirm the mechanism in the library source** (dependency code is evidence):
  the SDK's SSE decoder skips the `: ping` comment but the trailing blank line
  still *dispatches an event with an empty data buffer*, and the next layer calls
  `json.Unmarshal([]byte{})` → `unexpected end of JSON input`. Identical in two
  SDK versions. (This also violates the SSE spec, which says empty-data events must
  not be dispatched.)

This explains every observation: fast consumers (curl) never trigger a keepalive;
short answers finish before the first one; the slow service hits one at ~15s on
long answers. And "works with streaming, fails without" was a red herring — the
backend always streams; the toggle only changed whether the user saw partial
tokens before the same error.

## 5. Root cause + propose

The model was configured to use the provider's **OpenAI-compatible** endpoint,
whose SSE stream the SDK decoder mishandles on **keepalive/comment frames**. The
upstream provider sends those every 15s; the SDK turns one into a fatal JSON parse
error. Proposed fixes: (immediate/config) switch the model to the **native
provider**, which uses a non-SSE request and cannot hit the bug; (upstream/code)
make the decoder skip comment/empty frames.

Confidence: **high** — every competing hypothesis was falsified with first-hand
evidence, and the failing mechanism was read directly in the library source.

## 6. Verify the resolution

Re-ran the **same long-answer prompt** (move 2's handle) against an agent using the
native provider → `phase: done`, full multi-thousand-character essay returned. The
original symptom, under the original conditions, is gone — observed, not assumed.

---

## Why this is a good teaching case

- **The report's word was wrong.** "Timeout" and "streaming-vs-not" were plausible
  and both false. Treating them as hypotheses, not facts, is the whole game.
- **Falsification did the work.** Each cheap test was chosen to *kill* a candidate
  (different model, host vs pod curl, code search), not to comfort the favourite.
- **The breakthrough was changing conditions, not looking harder.** Throttling the
  consumer made an invisible variable (keepalives only sent to slow readers)
  visible. When cheap checks don't separate causes, change the setup.
- **Dependency source is evidence.** The decisive confirmation was reading the
  third-party SDK's decoder, not guessing about it.
- **It ends verified** — the original symptom re-checked and gone, with the fix
  confirmed end-to-end before claiming success.
