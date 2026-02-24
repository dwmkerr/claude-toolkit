# Verified Improvements

Human-verified improvements from real sessions. Each entry is a confirmed fix that resolved friction. This log is read by the skill to pattern-match similar problems and is the source of truth for evolving the skill's root cause table.

---

### learn-and-improve scope guidance was too rigid
- **Friction**: Skill said "prefer narrowest scope" which biased toward low-value project-local fixes instead of high-value skill/user-level improvements
- **Fix**: Replaced with a "who benefits" table explaining the reach of each improvement type, letting the user choose based on context
- **Scope**: All users of toolkit:learn-and-improve

### Skills with references/ prompt for Read permission
- **Friction**: Skills with `references/` directories triggered Read permission prompts when accessing their own bundled files
- **Fix**: Added `allowed-tools: Read, Grep` to frontmatter of all 8 skills with references, documented as standard pattern in skill-development skill ([claude-code#15757](https://github.com/anthropics/claude-code/issues/15757))
- **Scope**: All users of toolkit plugin skills
