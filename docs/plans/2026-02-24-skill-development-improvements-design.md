# Skill Development Skill Improvements

## Context

The skill-development skill teaches formatting/structure but not the thinking behind good skills. Anthropic's "Complete Guide to Building Skills for Claude" identifies gaps: use case planning, categories, patterns, testing, and troubleshooting.

## Changes

### SKILL.md (target ~160 lines)

- Add "Before You Start" section after Quick Reference — define use cases, pick a category
- Expand structure diagram to include `scripts/` and `assets/`
- Add "Testing Your Skill" section pointing to testing reference
- Add "Troubleshooting" section pointing to troubleshooting reference
- Update Quick Reference to list all reference files

### New Reference Files

1. **references/patterns.md** — Three skill categories (document creation, workflow automation, MCP enhancement) + five reusable patterns (sequential workflow, multi-MCP coordination, iterative refinement, context-aware tool selection, domain-specific intelligence)

2. **references/testing.md** — Three test dimensions (triggering, functional, performance comparison), success criteria (quantitative and qualitative), iteration signals (under/over-triggering, execution issues)

3. **references/troubleshooting.md** — Common problems and fixes: won't upload, doesn't trigger, triggers too much, instructions not followed, large context issues. Debugging approaches.

## Implementation

1. Create branch `feat/skill-development-improvements`
2. Write three new reference files
3. Update SKILL.md with new sections and references
4. Commit
