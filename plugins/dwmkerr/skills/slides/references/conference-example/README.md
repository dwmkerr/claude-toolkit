# Conference Deck Example

A complete, real-world example of a **conference-mode** deck — the deck from Dave
Kerr's [AI Native DevCon London 2026 talk](https://www.youtube.com/watch?v=ACL7_EsfIio)
("Bipolar Disorder, Dysregulation & AI"). Use it as a reference for how a finished
hand-built HTML deck is structured, versus the blank scaffold in
[`../../themes/conference/template/`](../../themes/conference/template/).

- [`presentation.html`](./presentation.html) — the deck. No framework, no build step;
  open it directly in a browser. Each slide is a `<section class="slide ...">` with a
  `data-name` attribute.
- [`notes.html`](./notes.html) — the standalone teleprompter sheet (speaker notes),
  readable on a phone or second screen.

The two embedded `drafts/mental-models/*.html` diagrams and `images/linkedin-qr.svg`
are included so the deck renders standalone.

The full talk is public: [video](https://www.youtube.com/watch?v=ACL7_EsfIio) ·
[blog post](https://dwmkerr.com/bipolar-dysregulation-and-ai/).
