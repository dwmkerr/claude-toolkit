# Conference Deck

Hand-built HTML conference deck. No framework. No build step. Edit the HTML directly.

## Files

| File | Purpose |
|------|---------|
| `presentation.html` | The deck. One `<section class="slide ...">` per slide. |
| `presentation.md`   | Single source of truth for speaker notes. |
| `notes.html`        | Baked teleprompter sheet, regenerated from `presentation.md`. |
| `Makefile`          | `dev`, `notes`, `deploy`, `deploy-presentation`, `deploy-notes`, `lab`, `help`. |
| `images/`           | Local assets (QR codes, photos, diagrams). |

## Quick start

```sh
make dev      # serve presentation.html on http://localhost:2663
make notes    # serve notes.html (use on a phone as a teleprompter)
make help     # list all targets
```

To publish to GitHub Pages, set `SITE_REPO` (and `PUBLIC_*_URL`) at the top of the `Makefile` to point at your `dwmkerr.com`-style site repo, then `make deploy`.

## Editing

Edit `presentation.html` to change a slide's structure or on-slide text. Each slide is a `<section class="slide ...">` with a `data-name` attribute used as its label.

Edit `presentation.md` to change speaker notes. Headings (`##` / `###`) map by index to slides in document order. The block above `---` is on-slide content for your reference; the block below is what you say. End each notes block with `*Clock: X:XX*`.

After editing notes in the md, regenerate `notes.html` by rewriting the entries inside `<div id="list">` from the parsed md. Keep the `notes.html` shell (CSS, controls bar, scripts) unchanged.

## Keyboard

| Key | Action |
|-----|--------|
| Right / Space / PageDown | Next slide (reveals fragments first on reveal slides) |
| Left  / PageUp           | Previous slide (un-reveals fragments first) |
| Up                       | Show in-deck speaker-notes overlay |
| Down                     | Hide overlay |
| F                        | Toggle fullscreen |
| Home / End               | First / last slide |

Slides with `data-reveal="true"` reveal `.revealable` items one at a time on Right.

## Colour convention

Apply consistently when colouring words, lines, table rows, and markers.

| Token | Hex | Meaning |
|-------|-----|---------|
| Red    | `#e8503a` | Bad / dysregulating / warning |
| Green  | `#6bbf73` | Good / regulating / managing |
| Blue   | `#4c8dd6` | Accent / anchored to baseline |
| Yellow | `#f2c94c` | Support / highlight |

The slate accent `#5e8a9c` and warm rust `#d99161` are the deck's neutral accents (eyebrows, section punches, decorative rules).

## Copy conventions

- **No em-dashes**. Use a regular hyphen. Do not let an editor or model "tidy up" hyphens into em-dashes.
- **No full stops at the end of slide leads or headings**. Body text and notes are normal prose.
- One central idea per slide. Whitespace-led. The slide is not the script.

## Slide types provided

- `title`       Title slide (talk title + author line).
- `disclaimer`  Warm-rust eyebrow above a big heading, plus a short paragraph.
- `content`     Standard eyebrow + heading + body / list slide.
- `chartslide`  Eyebrow + heading + a chart canvas (`.chart-wrap`).
- `punch`       Full-wash slate section divider.
- `regtable`    Two-column comparison table (bad vs good). `.recap-hero` upgrades the heading to title-page size.
- `jokes`       Progressive-reveal list with a punchline blockquote.
- `title split` Title-page style with an image (QR or photo) on the right.

Mix and match. Add your own slide types by adding a new class and a CSS block.
