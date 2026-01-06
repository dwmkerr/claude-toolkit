---
description: Show which skills were invoked during this session
---

# Skill History

Show which skills were invoked during the current Claude Code session.

> **CRITICAL**: Do NOT read the session file directly - it's too large. Use the Bash tool to run grepsession.sh which filters efficiently.

## Instructions

1. **Use Bash to run grepsession.sh**

   ```bash
   ./scripts/grepsession.sh '"name":"Skill"'
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
           "name": "Skill",
           "input": {
             "skill": "typescript-development",
             "args": ""
           }
         }
       ]
     }
   }
   ```

   Extract:
   - **Line number**: from grep prefix (e.g., `1247:{...}`)
   - **Time**: from `.timestamp`
   - **Skill**: from `.message.content[].input.skill`

3. **If you need more context**

   ```bash
   ./scripts/grepsession.sh '"name":"Skill"' -C 5
   ```

   Or use Read tool with offset/limit on the session file.

4. **To find what triggered each skill**

   Look for the most recent user message before each skill. User messages have this structure:

   ```json
   {
     "type": "user",
     "timestamp": "2025-01-05T09:23:00.000Z",
     "message": {
       "content": "fix the type errors in the project"
     }
   }
   ```

5. **Display results**

   Format timestamps as relative time (e.g., "3m ago", "1h ago", "2d ago").

   ```
   ## Skills Invoked This Session

   | Line | When     | Skill              | Triggered By                    |
   |------|----------|--------------------|--------------------------------|
   | 1247 | 2h ago   | typescript-dev     | "fix the type errors in..."    |
   | 1389 | 45m ago  | technical-writing  | "improve the readme..."        |

   **Total**: 2 skills invoked
   ```

## Notes

- Users can run `grepsession.sh` directly and pipe to `jq`
- Line numbers let you inspect specific parts of the session log
- Use `-C N` for context, `-A N` for after, `-B N` for before
