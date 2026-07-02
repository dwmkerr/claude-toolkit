---
name: slides
description: Create and manage presentation decks. Two modes - Slidev markdown (default) and "conference" hand-built HTML. Use when user asks to "create slides", "make a presentation", "add slides to this project", "set up a slide deck", or mentions "slidev", "pitch deck", "conference talk", "conference deck", or "slides folder".
---

# Slides

Scaffold and manage presentation decks in any project. Two modes:

- **Slidev mode (default)** - Markdown-driven decks using `@slidev/cli`. Best for project pitches, internal decks, README-driven content, and anything where the author edits markdown and lets Slidev render. Covered in the "Slidev Mode" section below.
- **Conference mode** - Hand-built HTML deck modelled on the AI Native DevCon London 2026 talk. Dark theme, Inter + JetBrains Mono, right-arrow progressive reveal, fullscreen, page number, in-deck notes overlay, separate teleprompter sheet for a phone, deployable to GitHub Pages via a `gh-pages` worktree. No framework, no build step - the author edits HTML directly. Covered in the "Conference Mode" section further below.

## 0. Ask which mode

When the user invokes the skill, ASK upfront:

> "Slidev (default) or conference (hand-built HTML)?"

Pick by signal too. Default to **Slidev** unless the user says any of: "conference", "conference talk", "conference deck", "hand-built", "no framework", "html deck", or references the AI Native DevCon style. If they pick conference, skip the Slidev sections and follow "Conference Mode" below.

## Slidev Mode

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

## Styling

Keep `slides.md` readable. Prefer built-in layouts and theme classes before writing custom CSS. Add styles selectively — not preemptively.

**Content first, styling after.** When a slide does need a `<style>` or `<style scoped>` block, put it at the *bottom* of the slide, just above the closing `---`. Slidev parses the whole slide regardless of position, so pushing CSS below the content means a reader opening `slides.md` sees the actual content first — if they then scroll past some styling, so be it.

If a pattern is reused across many slides (typography, card layouts, shared tables), promote it to the theme under `themes/<name>/styles/` instead of repeating it inline.

## Revision

When asked to edit slides:

1. Read `slides.md`
2. Make targeted edits — don't regenerate the whole deck
3. Suggest `make slides` to preview changes

## Themes

By default, use `theme: default` in frontmatter. Do NOT suggest or apply custom themes unless the user specifically asks about available themes.

Custom themes are local Slidev theme folders stored in this skill at `themes/<name>/`. To apply one, copy the theme folder into the slides directory and set `theme: ./<name>` in frontmatter.

### Available Themes

#### qblabs

Style inspired by QuantumBlack's publicly available visual identity. All colors, fonts, and design patterns sourced exclusively from public materials:

- [quantumblack.com](https://quantumblack.com) — public website (redirects to mckinsey.com/capabilities/quantumblack)
- [github.com/mckinsey/qbstyles](https://github.com/mckinsey/qbstyles) — matplotlib theme, dark bg `#0C1C23`
- [brandfetch.com/mckinsey.com](https://brandfetch.com/mckinsey.com) — public brand colors

**Setup**: Copy `themes/qblabs/` into the slides directory, then:

```markdown
---
theme: ./qblabs
title: "Deck Title"
---
```

**Layouts**:
- `cover` — dark navy background, blue accent bar, centered title
- `default` — clean white background, blue underline on h1
- `section` — dark navy section divider with blue accent

**Key colors** (from public QB website/branding):
- `#051C2C` — Dark navy (hero/section backgrounds)
- `#2251FF` — Electric blue (accent, links, CTAs)
- `#222222` — Body text (on light backgrounds)
- `#A2AAAD` — Secondary text (medium grey)

**Fonts**: Georgia (serif, headings) and Arial (sans, body) — standard PowerPoint substitutes for Bower and McKinsey Sans which are not publicly licensed.

**Utility classes**: `.qb-blue`, `.qb-navy`, `.qb-bg-dark`, `.qb-bg-light`, `.qb-accent-bar`

## Conference Mode

A hand-built HTML conference deck. **No framework, no Vue, no Slidev, no build step.** The author edits `presentation.html` directly. Speaker notes live in `presentation.md` and are baked into a standalone `notes.html` teleprompter sheet for a phone or second screen.

### When to use it

- A conference talk (20-45 minutes) where presence and feel matter as much as content.
- Dark theme, typographic, whitespace-led, minimal chrome.
- Custom interactions (right-arrow progressive reveal, hidden in-deck notes overlay, fullscreen toggle).
- Deploys to GitHub Pages via a `gh-pages` worktree, with separate public URLs for the deck and for the phone-readable notes sheet.

If the user wants a quick scaffold from a README, or wants Markdown-driven content with Slidev's built-in layouts, use **Slidev mode** instead.

For a complete real-world example of a finished conference deck (structure, slide markup), see [`references/conference-example.html`](references/conference-example.html) — the final deck from a real AI Native DevCon talk.

### Setup flow

1. Ask where to keep the deck. Suggest `./presentation` or a conference-specific folder name (for example `./conferences/<year>-<event>/`).
2. Copy everything under `themes/conference/template/` into the target folder verbatim. No `npm install`, no dependencies.
3. Tell the user:
   - `make dev` serves `presentation.html` on `http://localhost:2663`.
   - `make notes` serves `notes.html` (open on a phone for a teleprompter).
   - Edit `presentation.html` to change slide content.
   - Edit `presentation.md` to change speaker notes, then regenerate `notes.html` from it.
4. If the user wants `make deploy` to work, ask for their site repo path and the public URL pattern, then update `SITE_REPO`, `PUBLIC_NOTES_URL`, and `PUBLIC_PRESENTATION_URL` at the top of the `Makefile`.

### File layout

```
<deck-dir>/
├── presentation.html   # The deck (single hand-edited HTML file)
├── presentation.md     # Single source of truth for speaker notes
├── notes.html          # Baked teleprompter sheet (regenerated from md)
├── Makefile            # dev / notes / deploy / deploy-presentation / deploy-notes / lab / help
├── images/             # QR codes, photos, diagrams
└── README.md           # Quick start, conventions
```

### Slide markup conventions

- Each slide is a `<section class="slide <type>" data-name="<unique-id>">` block.
- Each slide uses an **eyebrow + heading** pattern: `<div class="label-in">Section name</div>` then `<h3>One central idea</h3>` (or `<h1>` for title slides, `<h2>` for disclaimer / punch).
- Slides that should reveal items one-at-a-time on Right have `data-reveal="true"` and mark each fragment with `class="revealable"`.
- The provided slide types: `title`, `disclaimer`, `content`, `chartslide`, `punch` (section divider), `regtable` (two-column bad-vs-good table, optionally `recap-hero`), `jokes` (progressive reveal list with punchline), `title split` (title + image / QR on the right).

### Copy conventions

- **No em-dashes.** Use a regular hyphen. Do not "tidy up" hyphens into em-dashes anywhere.
- **No full stops at the end of slide leads or headings.** Body text and notes are normal prose.
- One central idea per slide. Whitespace-led. The slide is not the script.

### Colour convention

Apply consistently when colouring words, lines, table rows, and markers.

| Token | Hex | Meaning |
|-------|-----|---------|
| Red    | `#e8503a` | Bad / dysregulating / warning |
| Green  | `#6bbf73` | Good / regulating / managing |
| Blue   | `#4c8dd6` | Accent / anchored to baseline |
| Yellow | `#f2c94c` | Support / highlight |

The slate accent (`#5e8a9c`) and warm rust (`#d99161`) are the deck's neutral accents - eyebrows, section punches, decorative rules.

### Speaker notes flow

- `presentation.md` is the **single source of truth** for speaker notes. The deck (`presentation.html`) is the public artefact and should not carry full notes inline.
- Each slide in `presentation.md` is a `##` or `###` heading. On-slide content sits above `---`; speaker notes sit below `---`. End each notes block with `*Clock: X:XX*` for pacing.
- Top-level `#` headings in the md are the author's organising structure (parts / acts) - they are scaffolding, not slides. Skip them when regenerating.
- When notes change, regenerate `notes.html` by rewriting the entries inside its `<div id="list">` block from the parsed md, pairing each md slide by index with the deck's `data-name` order. Keep the `notes.html` shell (CSS, controls bar, fonts / theme JS) untouched.

### Deploy pattern

`make deploy-presentation` and `make deploy-notes` publish straight to the `gh-pages` branch of `SITE_REPO` via a throwaway `git worktree`. Each pushes a single commit. The deck lives at `<site>/presentation/presentation.html`; the notes sheet lives at `<site>/presentation/notes.html`. The phone-readable notes URL is meant to be opened on a second screen during the talk.

## Example Interactions

**User**: "Add slides to this project"
1. Ask: "Slidev (default) or conference (hand-built HTML)?"
2. If Slidev: ask where to keep them (suggest `./slides`), scaffold folder with `theme: default`, run `npm install`, tell user `cd slides && make slides` to open.
3. If conference: ask where to keep the deck (suggest `./presentation` or `./conferences/<year>-<event>/`), copy `themes/conference/template/*` into it, tell user `make dev` to open.

**User**: "Create a conference talk deck" or "Set up a hand-built HTML deck"
1. Skip the Slidev question - go straight to conference mode.
2. Ask where to keep the deck.
3. Copy `themes/conference/template/*` into the target folder.
4. Tell user: `make dev` to preview, edit `presentation.html` for content and `presentation.md` for notes, regenerate `notes.html` from md when notes change.

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

**User**: "What themes are available?" or "Use the qblabs theme"
1. List available themes from the Themes section above
2. If user picks one, copy the theme folder into the slides directory
3. Update frontmatter to `theme: ./<name>`
