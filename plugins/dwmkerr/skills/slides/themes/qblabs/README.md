# qblabs — Slidev Theme

Presentation theme inspired by QuantumBlack's publicly available visual
identity. This is an approximation — not an official brand guide.

## Public Sources

All colors, fonts, and design patterns are sourced exclusively from publicly
available materials. No internal or confidential materials were used.

**Public websites:**
- [mckinsey.com/capabilities/quantumblack](https://www.mckinsey.com/capabilities/quantumblack/how-we-help-clients) — QuantumBlack public website (quantumblack.com redirects here)
- [mckinsey.com/capabilities/quantumblack/labs/our-products](https://www.mckinsey.com/capabilities/quantumblack/labs/our-products) — QB Labs product pages

**Public GitHub repos:**
- [github.com/mckinsey/qbstyles](https://github.com/mckinsey/qbstyles) — QuantumBlack matplotlib theme (dark background `#0C1C23`)

**Public brand analysis:**
- [brandfetch.com/mckinsey.com](https://brandfetch.com/mckinsey.com) — publicly scraped brand colors from mckinsey.com
- [slideworks.io — Decoding McKinsey's visual identity](https://slideworks.io/resources/decoding-mckinseys-visual-identity-and-powerpoint-template) — analysis of McKinsey PowerPoint template fonts (Georgia, Arial)

**Public social/media:**
- [QuantumBlack on Medium](https://quantumblack.medium.com/) — public blog posts
- [QuantumBlack on LinkedIn](https://www.linkedin.com/company/quantumblack) — public company page

## Usage

Copy this folder into your slides directory, then set the theme in frontmatter:

```markdown
---
theme: ./qblabs
---
```

## Colors

Derived from public website CSS and the qbstyles GitHub repo:

| Role | Hex | Notes |
|------|-----|-------|
| Dark navy | `#051C2C` | Hero/section backgrounds |
| Electric blue | `#2251FF` | Accent, links, CTAs |
| Dark bg (charts) | `#0C1C23` | From mckinsey/qbstyles |
| White | `#FFFFFF` | Primary light background |
| Body text | `#222222` | Near-black on light bg |
| Secondary text | `#A2AAAD` | Medium grey |

## Fonts

Georgia (serif, headings) and Arial (sans-serif, body). These are the standard
PowerPoint substitutes for Bower and McKinsey Sans, which are not publicly
licensed. Font pairing documented in the Slideworks analysis linked above.

## Layouts

- `cover` — dark navy background with blue accent bar, centered title
- `default` — clean white background, blue underline on h1
- `section` — dark navy section divider with blue accent
