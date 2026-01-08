---
description: Show which agents were invoked during this session
---

# Agent History

Show which agents were spawned during the current Claude Code session.

> **CRITICAL**: Do NOT read the session file directly - it's too large. Use the Bash tool to run grepsession.sh which filters efficiently.

## Instructions

1. **Use Bash to run grepsession.sh**

   ```bash
   ${CLAUDE_PLUGIN_ROOT}/scripts/grepsession.sh '"name":"Task"'
   ```

   This outputs matching lines with line numbers from the current session.

2. **Parse the output**

   Each line is JSONL with this structure:

   ```json
   {
     "type": "assistant",
     "timestamp": "2025-01-05T09:23:15.123Z",
     "message": {
       "content": [
         {
           "type": "tool_use",
           "name": "Task",
           "input": {
             "description": "Research Claude plugins",
             "subagent_type": "dwmkerr:researcher",
             "prompt": "..."
           }
         }
       ]
     }
   }
   ```

   Extract:
   - **Line number**: from grep prefix (e.g., `1247:{...}`)
   - **Time**: from `.timestamp`
   - **Agent**: from `.message.content[].input.subagent_type`
   - **Description**: from `.message.content[].input.description`

3. **If you need more context**

   ```bash
   ${CLAUDE_PLUGIN_ROOT}/scripts/grepsession.sh '"name":"Task"' -C 5
   ```

   Or use Read tool with offset/limit on the session file.

4. **To find what triggered each agent**

   Look for the most recent user message before each agent. User messages have this structure:

   ```json
   {
     "type": "user",
     "timestamp": "2025-01-05T09:23:00.000Z",
     "message": {
       "content": "are there github repos showing how to check skills?"
     }
   }
   ```

5. **Display results**

   Format timestamps as relative time (e.g., "3m ago", "1h ago", "2d ago").

   ```
   ## Agents Spawned This Session

   | Line | When     | Agent          | Task                         | Triggered By               |
   |------|----------|----------------|------------------------------|----------------------------|
   | 1247 | 2h ago   | researcher     | Research Claude plugins      | "are there github repos..."
   | 1389 | 1h ago   | researcher     | Clone and examine repo       | "are there github repos..."

   **Total**: 2 agents spawned
   ```

## Notes

- Uses the same `grepsession.sh` script from the skills plugin
- Users can run `grepsession.sh` directly and pipe to `jq`
- Line numbers let you inspect specific parts of the session log
