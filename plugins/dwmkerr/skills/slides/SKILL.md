---
name: slides
description: Create and manage Slidev presentation decks. Use when user asks to "create slides", "make a presentation", "add slides to this project", "set up a slide deck", or mentions "slidev", "pitch deck", or "slides folder".
---

# Slides

Scaffold and manage Slidev markdown slide decks in any project.

## Setup Flow

### 1. Ask where to keep slides

Ask the user where to create the slides folder. Suggest `./slides` as default.

### 2. Scaffold the folder

Create the following structure:

```
<slides-dir>/
├── slides.md       # Slide content (Slidev markdown)
├── package.json    # Slidev dependencies
├── Makefile        # Convenience targets
└── public/         # Static assets (images, diagrams)
```

#### `package.json`

```json
{
  "name": "slides",
  "private": true,
  "scripts": {
    "dev": "slidev slides.md --open",
    "build": "slidev build slides.md",
    "export": "slidev export slides.md"
  },
  "dependencies": {
    "@slidev/cli": "^52.11.5",
    "@slidev/theme-default": "^0.25.0"
  }
}
```

#### `Makefile`

```makefile
.PHONY: slides slides-build slides-export slides-setup

slides: node_modules ## Open slides in browser with hot-reload
	npx slidev slides.md --open

slides-build: node_modules ## Build static SPA to ./dist
	npx slidev build slides.md

slides-export: node_modules ## Export slides to PDF
	npx slidev export slides.md

slides-setup: ## Install dependencies
	npm install

node_modules: package.json
	npm install
	@touch node_modules
```

#### `slides.md` (starter)

Generate a title slide using the project name. Use this template:

```markdown
---
theme: default
title: "<Project Name>"
---

# <Project Name>

<One-line project description from README or user prompt.>

---

# Overview

- Point one
- Point two
- Point three
```

### 3. Install dependencies

Run `npm install` inside the slides folder.

### 4. Add to .gitignore

If a `.gitignore` exists in the slides folder or project root, ensure `node_modules/` and `dist/` are ignored. Check before adding to avoid duplicates.

## Content Generation

When asked to generate or write slide content:

1. Read the source material (README, docs, solution.md, or user prompt)
2. Write slides in Slidev markdown format:
   - `---` separates slides
   - YAML frontmatter on first slide sets theme and title
   - Standard markdown for content (headers, lists, code blocks, images)
   - Images go in `public/` and are referenced as `/image.png`
3. Keep slides concise — one idea per slide, max 5-6 bullet points
4. Write directly to `slides.md`

### Slidev Markdown Quick Reference

```markdown
---
theme: default
title: "Deck Title"
---

# Slide Title

Regular markdown content.

---

# Code Slide

\`\`\`python
def hello():
    print("hello")
\`\`\`

---

# Image Slide

<img src="/diagram.png" class="h-80" />

---
layout: two-cols
---

# Left Column

Content here.

::right::

# Right Column

Content here.

---
layout: center
---

# Centered Content

Big statement.
```

### Available Layouts

- `default` — standard content
- `center` — centered on page
- `two-cols` — split with `::right::` separator
- `image-right` / `image-left` — content + image side by side
- `cover` — title/cover slide
- `section` — section divider

## Revision

When asked to edit slides:

1. Read `slides.md`
2. Make targeted edits — don't regenerate the whole deck
3. Suggest `make slides` to preview changes

## Example Interactions

**User**: "Add slides to this project"
1. Ask where to keep them (suggest `./slides`)
2. Scaffold folder with starter deck
3. Run `npm install`
4. Tell user: `cd slides && make slides` to open in browser

**User**: "Create slides from the README"
1. If slides folder exists, read `slides.md` to understand current state
2. If no slides folder, scaffold first
3. Read README.md
4. Generate slide content and write to `slides.md`
5. Suggest `make slides` to preview

**User**: "Add a slide about the architecture"
1. Read `slides.md`
2. Add new slide section with `---` delimiter
3. Suggest `make slides` to preview
