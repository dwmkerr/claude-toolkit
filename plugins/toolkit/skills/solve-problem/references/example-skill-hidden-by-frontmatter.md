# Worked example: a skill missing from the menu, blamed on the cache

A user reported: **"I can't invoke my personal writing-style skill"** — it was
missing from the slash-command menu. The fix turned out to be one line in the
skill's own frontmatter. But before anyone read that line, three surface-driven
guesses were each declared the cause in turn — a prefix, a menu label, and a
plugin cache mismatch. This is the canonical trap the skill exists to prevent:
theorizing from the surfaces (menu, labels, error text) instead of reading the
artifact that *defines* the behaviour.

---

## 1. Understand intent

The user meant **their personal writing-style skill** — a specific skill they
expected to see and invoke from the menu. The first response answered a
*different* skill of a similar name by telling them to "just use the `ps:`
prefix." That is a Move 1 miss: the intent was never restated and confirmed, so
the wrong artifact got diagnosed. Restated correctly: *the skill the user
authored does not appear in the slash menu, so they cannot invoke it.* "Solved" =
that skill shows up and runs.

## 2. See the problem — first-hand, repeatably

The handle is cheap and repeatable: open the slash menu and look for the skill.
It is absent, every time. That absence — not any error message — is the symptom
to re-check at the end (move 6). What actually happened instead was a jump
straight to fixes without pinning this symptom down as the thing to make go away.

## 3. Hypothesize (≥2, including unlikely ones)

The candidates that a proper look would list:

1. The skill is defined but **hidden from the menu** by its own metadata
   (frontmatter).
2. The plugin providing it is on a **stale/mismatched cached version**, so the
   current definition isn't loaded.
3. It needs a **namespace prefix** to invoke (the first guess).
4. It's **"locked by plugin"** — the label shown in the menu.

Note the failure mode here: instead of holding these side by side, each was
adopted *singly* and declared the cause, one after another — exactly the tunnel
vision the "at least two hypotheses" rule forbids.

## 4. Gather evidence (read the definition first; try to falsify)

What the surface-driven pass actually did — three guesses, none of which read the
artifact that *defines* menu visibility:

- **Guess 1 — "use the `ps:` prefix."** This answered a *different* skill than the
  user meant. A Move 1 intent miss dressed up as a fix. It never touched the real
  skill.
- **Guess 2 — "locked by plugin."** A menu **label** was read as the cause. It is
  normal behaviour — a red herring. A surface signal (a badge) adopted as state.
- **Guess 3 — plugin cache/version mismatch (rc1).** A real-looking version
  mismatch in the plugin cache. After `/reload-plugins` cleared a cache error, the
  assistant declared **"FIXED"** — on a proxy signal, without re-checking the menu.

The decisive check was the one nobody ran until the end: **read the skill's
`SKILL.md` frontmatter** — the artifact that defines whether a skill appears in
the menu. It contained:

```yaml
user_invocable: false
```

That single field hides the skill from the slash menu. Reading the definition —
the cheapest, most decisive evidence — would have isolated it in one step, ahead
of every guess about prefixes, labels, and caches.

Crucially, hypothesis 2 was **real but secondary**: the cache/version mismatch was
a genuine second problem, just not the one the user reported. The symptom had
**two causes**, and clearing the smaller one is what produced the false "FIXED."

## 5. Root cause + propose

Root cause: `user_invocable: false` in the skill's frontmatter kept it out of the
menu. Fix: set it to `true` (or remove the field) so the skill is invocable. The
plugin cache/version mismatch was a **second, contributing** problem worth fixing
too — but fixing it alone never restored the skill, because it was not the cause
of the reported symptom.

Confidence: **high** — the visibility rule is defined directly by the frontmatter
field that was read first-hand.

## 6. Verify the resolution

Verification is re-observing **the exact symptom the user reported**: open the
slash menu and confirm the skill now appears and invokes. Clearing the cache error
was **not** that — it was a secondary signal going green while the original symptom
(skill absent from menu) still persisted. "FIXED" was declared on the proxy. The
resolution is only proven when the menu shows the skill, observed, not assumed.

---

## Why this is a good teaching case

- **The fix was in the definition, not the surfaces.** The menu label, the cache
  error, and the prefix were all downstream renderings. The one artifact that
  *defines* menu visibility — the frontmatter — was read last, and it settled it
  instantly.
- **Surface signals are hypotheses.** A "locked by plugin" label and a cache
  error string are the system's rendering of its state, not the state. Both were
  adopted as fact; both were misleading.
- **A secondary signal clearing is not the symptom clearing.** `/reload-plugins`
  fixed a real but secondary problem and produced a false "FIXED" while the
  reported symptom persisted. Move 6 means re-observing *the user's* symptom.
- **A symptom can have two causes.** The frontmatter was primary; the cache
  mismatch was a genuine second contributor. Clearing one is not clearing the
  symptom.
- **Intent first.** The very first "fix" answered the wrong skill — a Move 1 miss
  that cost the whole opening exchange.
