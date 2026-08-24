---
name: pdf-sign
description: This skill should be used when the user asks to "sign this PDF", "fill in this form", "add my signature to", or mentions signing letters, claim forms, or contracts. Overlays a signature image, ticks checkboxes, and fills date/name/phone fields on scanned or digital PDFs using pymupdf, with OCR fallback for scanned documents.
---

# PDF Sign

Sign and fill PDF forms programmatically. Works on both digital PDFs (with a text layer) and scanned PDFs (via OCR).

## Signature image

**Always ask the user where their signature image is** — never assume a location, and never commit a signature image to a repository. A scanned signature (dark ink on white) works best.

If the image has a white background (typical JPG scan), convert it to a transparent PNG first — otherwise the overlay blanks out any text or lines beneath it:

```python
from PIL import Image
img = Image.open(SRC_JPG).convert("RGBA")
img.putdata([(0, 0, 0, 0 if (r+g+b)//3 > 200 else 255-(r+g+b)//3)
             for r, g, b, a in img.getdata()])
img.save(OUT_PNG)
```

Save the transparent version next to the original so it can be reused.

## Setup

pymupdf in a venv (system Python is often externally managed):

```bash
python3 -m venv ./scratch/venv   # or /tmp outside a repo
./scratch/venv/bin/pip install -q pymupdf pillow
```

OCR (scanned PDFs) needs tesseract: `brew install tesseract`, and set `TESSDATA_PREFIX` (Homebrew: `/opt/homebrew/share/tessdata`).

## Approach

1. **Try text search first.** `page.search_for("SIGNATURE:")` — a digital PDF locates fields directly.
2. **Scanned PDF → `page.get_text()` returns empty.** Fall back to an OCR textpage:
   ```python
   tp = page.get_textpage_ocr(full=True, dpi=200)
   hits = page.search_for("SIGNATURE:", textpage=tp)
   ```
3. **Place content relative to the found label rects** (see recipe).
4. **Always render and visually verify** each modified page before declaring done:
   ```python
   page.get_pixmap(dpi=100).save("check.png")
   ```
   Read the PNG — misplaced marks are common on the first pass.

## Recipe

```python
import os
os.environ.setdefault("TESSDATA_PREFIX", "/opt/homebrew/share/tessdata")
import pymupdf

doc = pymupdf.open(SRC)
page = doc[0]
tp = page.get_textpage_ocr(full=True, dpi=200)  # omit for digital PDFs

def find(needle):
    hits = page.search_for(needle, textpage=tp)
    return hits[0] if hits else None

# Signature: transparent PNG spanning the line, right of the label
r = find("SIGNATURE:")
page.insert_image(pymupdf.Rect(r.x1 + 40, r.y0 - 32, r.x1 + 180, r.y1 + 4),
                  filename=SIGNATURE_PNG, keep_proportion=True)

# Text field: right of label, baseline-aligned
r = find("DATE:")
page.insert_text((r.x1 + 15, r.y1 - 2), "01/31/2026", fontsize=11, color=(0, 0, 0.55))

# Checkbox: box sits ~22pt left of its label text
r = find("Check here if your name")
page.insert_text((r.x0 - 22, r.y1 - 2), "X", fontsize=12, color=(0, 0, 0.55))

doc.save(OUT)  # never overwrite the source
```

Blue-ish ink (`color=(0, 0, 0.55)`) reads as pen on printed forms. Match the form's date format (US forms: MM/DD/YYYY).

## Gotchas

| Problem | Fix |
|---|---|
| `search_for` finds nothing, no error | Scanned page with no text layer — check `len(page.get_text()) == 0`, use OCR textpage |
| Label matches twice (e.g. `DATE:` also hits `Check Date:` header) | Filter hits by y-position, e.g. same line as the SIGNATURE match: `abs(h.y1 - rsig.y1) < 8` |
| Partial-phrase match places mark mid-sentence | Anchor x on a reliably-found label (e.g. checkbox column from the first checkbox label), use the phrase match only for y |
| Checkbox X lands on text | Checkbox is left of label: `x0 - 22` works for typical forms; verify visually |
| Signature overlay blanks out text/lines beneath it | White image background — convert to transparent PNG (see above) |
| Multi-copy documents (same letter × N pages) | Loop the letter pages, skip FAQ/back pages |
| Draft email already carries the old attachment after re-signing | Mail clients attach a snapshot; discard the draft and recreate it with the new file |
| `import fitz` deprecation warning | Use `import pymupdf` |

## Workflow

1. Ask the user for the signature image location (and any fill values: date, printed name, phone)
2. Save/locate the source PDF
3. Sign to a new file `<name> - Signed.pdf` — never overwrite the source
4. Render pages → view the PNGs → verify placement
5. Iterate until correct, then hand back or attach to a draft email
