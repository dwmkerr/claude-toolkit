# Skill Best Practices

Official guidance from Anthropic: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices

## Core Principles

### Concise is Key

The context window is shared. Only add context Claude doesn't already have.

**Good** (~50 tokens):
```markdown
## Extract PDF text

Use pdfplumber for text extraction:

```python
import pdfplumber
with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```
```

**Bad** (~150 tokens):
```markdown
## Extract PDF text

PDF (Portable Document Format) files are a common file format that contains
text, images, and other content. To extract text from a PDF, you'll need to
use a library. There are many libraries available...
```

### Set Appropriate Freedom

Match specificity to task fragility:

| Freedom | When to Use | Example |
|---------|-------------|---------|
| High | Multiple valid approaches | Code review guidelines |
| Medium | Preferred pattern with variation | Template with parameters |
| Low | Fragile/critical operations | Database migrations |

---

## Writing Descriptions

**Always third person:**
- Good: "Processes Excel files and generates reports"
- Bad: "I can help you process Excel files"
- Bad: "You can use this to process Excel files"

**Be specific with triggers:**

```yaml
# Good - specific triggers and context
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.

# Bad - vague
description: Helps with documents
```

---

## Progressive Disclosure

SKILL.md is the overview. Details go in reference files.

### Pattern 1: High-level with references

```markdown
# PDF Processing

## Quick start
[Essential code here]

## Advanced features
**Form filling**: See [FORMS.md](FORMS.md)
**API reference**: See [REFERENCE.md](REFERENCE.md)
```

### Pattern 2: Domain organization

```
bigquery-skill/
├── SKILL.md
└── reference/
    ├── finance.md
    ├── sales.md
    └── product.md
```

### Pattern 3: Conditional details

```markdown
# DOCX Processing

## Creating documents
Use docx-js. See [DOCX-JS.md](DOCX-JS.md).

## Editing documents
For simple edits, modify XML directly.

**For tracked changes**: See [REDLINING.md](REDLINING.md)
```

### Avoid Deep Nesting

Keep references one level deep from SKILL.md:

```markdown
# Bad - too deep
SKILL.md → advanced.md → details.md

# Good - flat
SKILL.md → advanced.md
SKILL.md → reference.md
SKILL.md → examples.md
```

---

## Workflows and Feedback Loops

### Clear Steps with Checklists

```markdown
## Research workflow

Copy this checklist:

```
- [ ] Step 1: Read source documents
- [ ] Step 2: Identify key themes
- [ ] Step 3: Cross-reference claims
- [ ] Step 4: Create summary
- [ ] Step 5: Verify citations
```

**Step 1: Read source documents**
Review each document in `sources/`. Note main arguments.
...
```

### Validation Loops

```markdown
## Document editing

1. Make edits to `document.xml`
2. **Validate**: `python scripts/validate.py`
3. If validation fails:
   - Review error message
   - Fix issues
   - Validate again
4. **Only proceed when validation passes**
```

---

## Naming Conventions

Use gerund form (verb + -ing):

**Good:**
- `processing-pdfs`
- `analyzing-spreadsheets`
- `managing-databases`
- `testing-code`

**Avoid:**
- `helper`, `utils`, `tools` (vague)
- `documents`, `data`, `files` (generic)
- `anthropic-helper`, `claude-tools` (reserved)

---

## Content Guidelines

### Avoid Time-Sensitive Info

```markdown
# Bad
If you're doing this before August 2025, use the old API.

# Good - use "old patterns" section
## Current method
Use the v2 API endpoint.

## Old patterns
<details>
<summary>Legacy v1 API (deprecated)</summary>
The v1 API used: `api.example.com/v1/messages`
</details>
```

### Consistent Terminology

Choose one term and stick with it:

- Always "API endpoint" (not "URL", "route", "path")
- Always "field" (not "box", "element", "control")
- Always "extract" (not "pull", "get", "retrieve")

---

## Common Patterns

### Template Pattern

```markdown
## Report structure

Use this template:

```markdown
# [Analysis Title]

## Executive summary
[One-paragraph overview]

## Key findings
- Finding 1 with data
- Finding 2 with data

## Recommendations
1. Actionable recommendation
```
```

### Examples Pattern

```markdown
## Commit messages

**Example 1:**
Input: Added user authentication
Output:
```
feat(auth): implement JWT authentication
```

**Example 2:**
Input: Fixed date display bug
Output:
```
fix(reports): correct date formatting
```
```

---

## Technical Requirements

### YAML Frontmatter

| Field | Rules |
|-------|-------|
| name | Max 64 chars, lowercase/numbers/hyphens, no reserved words |
| description | Max 1024 chars, non-empty, no XML tags |

### Token Budget

- Keep SKILL.md body under 500 lines
- Split larger content into reference files

### File Paths

Always use forward slashes:
- Good: `scripts/helper.py`
- Bad: `scripts\helper.py`

---

## Checklist

Before sharing a skill:

**Core quality:**
- [ ] Description specific with triggers
- [ ] SKILL.md under 500 lines
- [ ] Details in separate files
- [ ] No time-sensitive info
- [ ] Consistent terminology
- [ ] Concrete examples
- [ ] References one level deep

**If using scripts:**
- [ ] Scripts handle errors explicitly
- [ ] No magic constants
- [ ] Required packages listed
- [ ] Clear documentation
