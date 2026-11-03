---
name: editable-html
description: Let the user edit the copy of an HTML page or web app in the browser while an agent applies each change to the source in real time. Use when the user asks to "make the html editable", "let me edit the text", "live edit", "edit copy in the browser", "watch my edits", or wants to tweak wording on a page, visual, slide or app UI without hunting through the source.
---

# Editable HTML

The user edits text directly on the rendered page. Each edit is queued to a file. The agent watches the queue and applies the change to the real source, so build steps, templates and generated files stay in sync.

```
browser (press e, click, type)
   │  POST /api/dev/live-edit {oldText, newText, binding, tag, parentText}
   ▼
scratch/live-edit/edits.jsonl ──watched by──▶ agent edits source files
                                                  │
scratch/live-edit/applied.jsonl ◀─────────────────┘  (badge shows "N waiting")
```

Why a queue and not a direct save: the rendered page is rarely the source. Text may come from a template, a script data array, a generator, or a component. The agent knows where it lives; the browser does not.

## Pick a mode

| Situation | Mode |
|---|---|
| Static HTML file, visual, one-off page | **Static**: `references/live_edit_server.py` serves the page with the script injected |
| App with a dev server (Next.js, Vite, etc.) | **App**: add a dev-only API route and mount the overlay in dev builds |
| Standalone file the user keeps, no agent loop | **Download**: `E` to edit, `Cmd+S` downloads the edited HTML (see `dwmkerr:slides` conference mode) |

Default to **Static** unless the project already has a dev server.

## Static mode

1. Copy `references/live-edit.js` and `references/live_edit_server.py` into `./scratch/live-edit/` (gitignored). Never into the shipped page.
2. Start the server in the background:
   ```bash
   python3 scratch/live-edit/live_edit_server.py path/to/page.html 8772 scratch/live-edit
   ```
3. Watch the queue with Monitor (or a background `tail`), one notification per edit:
   ```bash
   f=scratch/live-edit/edits.jsonl; touch "$f"; tail -n 0 -F "$f"
   ```
4. Tell the user:
   - Open `http://127.0.0.1:8772/page.html`
   - Press `e` to toggle edit mode, click any text, type
   - Click away, `Esc` or `Cmd+S` sends the edit
   - Badge shows how many edits are still waiting
   - Reload to see the applied file

## App mode

Copy the shape of the static server into the app:

- `GET /api/dev/live-edit` returns `{queued}` (lines in `edits.jsonl` minus lines in `applied.jsonl`)
- `POST /api/dev/live-edit` appends `{ts, ...body}` to `edits.jsonl`
- Both return 404 unless `NODE_ENV === "development"`: the route writes to the working tree
- Mount `live-edit.js` (or a component port of it) only in dev builds
- Put the queue outside the app (`LIVE_EDIT_FILE` env var) so a containerised dev server and the host agent share it via a mount

Next.js example: `ui/app/api/dev/live-edit/route.ts` plus a `<LiveEdit />` client component rendered when `process.env.NODE_ENV === "development"`.

## Applying edits

For each queued line:

1. Read the full line from `edits.jsonl`. Monitor notifications truncate long text.
2. Find `oldText` in the source. Check every place it lives: the shipped file, templates, generator scripts, data files. Fix all of them, or a rebuild reverts the edit.
3. If `binding` is set, the text comes from script data (e.g. `data-text="cap.title"`), not the markup. Search the data, not the HTML.
4. Escape for the target context. A straight `'` inside a single-quoted JS string ends the string and breaks the page. Use curly quotes or escape it.
5. Append `{ts, result: "applied" | "not found" | "skipped", old, new}` to `applied.jsonl` so the badge count drops.
6. Report briefly. Flag typos or factual problems in the new copy and suggest a fix, but apply what the user wrote.

A small `apply_edit.py <ts> <old> <new>` helper that does steps 2, 4 and 5 across a fixed file list is worth writing when edits are frequent.

## Make pages edit-friendly

- Text rendered from JS data: add `data-text="<key>"` on the element so edits carry a binding.
- `contenteditable="plaintext-only"` stops pasted markup leaking into the queue.
- The script listens in the capture phase and swallows clicks while editing, so the page's own handlers (steps, carousels, links) do not fire.

## Gotchas

- **User still sees old text after a structural change.** Their open page holds what they typed. Ask them to reload.
- **Edit not found.** Rendered text differs from source: whitespace, entities (`&amp;`), `’` escapes, text split across elements. Try those forms before giving up.
- **Server stops with the session.** It is a background task. Restart it in a new session.
- **Security.** Bind to `127.0.0.1` only and never ship the script or route. Anything that can POST to it can edit your working tree via the agent.

## References

- `references/live-edit.js`: browser overlay (toggle, hover outline, plaintext editing, queue badge)
- `references/live_edit_server.py`: static server that injects the overlay and owns the queue
