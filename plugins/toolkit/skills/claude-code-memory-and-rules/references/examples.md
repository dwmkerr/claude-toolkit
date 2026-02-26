# Examples

Real-world memory and rules configurations.

## Project CLAUDE.md

### Node.js Project

```markdown
# Project Instructions

## Commands
- Install: `npm install`
- Test: `npm test`
- Lint: `npm run lint`
- Build: `npm run build`
- Dev server: `npm run dev`

## Code Style
- Use TypeScript strict mode
- Prefer named exports
- Use 2-space indentation
- No default exports except for Next.js pages

## Architecture
- API routes: src/api/
- Business logic: src/services/
- Database: src/db/ (queries only here)
- Shared types: src/types/
```

### Python Project

```markdown
# Project Instructions

## Commands
- Install: `pip install -e ".[dev]"`
- Test: `pytest`
- Lint: `ruff check .`
- Format: `ruff format .`
- Type check: `mypy src/`

## Conventions
- Use dataclasses for DTOs, Pydantic for validation
- Async handlers in src/api/, sync logic in src/core/
- All public functions need docstrings
```

## Path-Scoped Rules

### API Validation

```yaml
# .claude/rules/api-validation.md
---
paths:
  - "src/api/**/*.ts"
---

# API Rules

- All endpoints validate input with zod schemas
- Return standard error format: { error: string, code: number }
- Include rate limiting on public endpoints
- Log all 5xx errors with request context
```

### Test Conventions

```yaml
# .claude/rules/testing.md
---
paths:
  - "**/*.test.ts"
  - "**/*.spec.ts"
---

# Testing Rules

- Use describe/it blocks, not test()
- One assertion per test when possible
- Mock external services, never real APIs
- Test file mirrors source: src/foo.ts -> src/foo.test.ts
```

### React Components

```yaml
# .claude/rules/frontend/react.md
---
paths:
  - "src/components/**/*.tsx"
---

# React Rules

- Functional components only
- Props interface named {ComponentName}Props
- Use CSS modules for styling
- Extract hooks into src/hooks/ when reused
```

## User-Level CLAUDE.md

```markdown
# My Preferences

## General
- Use conventional commits (feat:, fix:, docs:, chore:)
- Prefer simple solutions over clever ones
- No comments that describe what code does — only why

## Tools
- Use pnpm, not npm
- Use Makefile for project tasks
- Use release-please for versioning
```

## CLAUDE.local.md

```markdown
# Local Dev Notes

- API runs on localhost:3001 (not default 3000, conflicts with other project)
- Test DB: postgresql://localhost:5433/myapp_test
- Use `SKIP_SEED=1 npm test` for faster test runs
```

## Imports

### Shared Instructions Across Worktrees

```markdown
# CLAUDE.md
See @README for project overview.

# Personal preferences (shared across worktrees)
- @~/.claude/my-project-prefs.md
```

### Documentation References

```markdown
# CLAUDE.md
Architecture details: @docs/architecture.md
API conventions: @docs/api-guide.md
```
