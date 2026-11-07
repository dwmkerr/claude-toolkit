---
description: Run a request on Sonnet, faster and cheaper than Opus, e.g. /toolkit:vfast check open bugs
argument-hint: <request>
model: sonnet
---

# Very Fast

Handle this request quickly:

$ARGUMENTS

## Instructions

- If the request is empty, ask what to run and stop.
- Do the work directly with the fewest tool calls needed. Do not spawn subagents unless the request asks for them.
- Keep the answer short. Lead with the result.
- If the request needs deep reasoning or design work, say so in one line and suggest re-running it without `/toolkit:vfast`.
