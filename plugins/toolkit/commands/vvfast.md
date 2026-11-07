---
description: Run a request on Haiku, the fastest and cheapest model, e.g. /toolkit:vvfast check open bugs
argument-hint: <request>
model: haiku
---

# Very Very Fast

Handle this request quickly and cheaply:

$ARGUMENTS

## Instructions

- If the request is empty, ask what to run and stop.
- Do the work directly with the fewest tool calls needed. Do not spawn subagents unless the request asks for them.
- Keep the answer short. Lead with the result.
- If the request needs deep reasoning, large refactors, or design work, say so in one line and suggest `/toolkit:vfast` or no command.
