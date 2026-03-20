---
name: drawio-diagram
description: Generate .drawio architecture diagrams with consistent visual style and export to PNG/SVG/PDF/HTML. Use when user asks to "create a diagram", "draw architecture", "make a drawio file", "build a diagram", or mentions "drawio", "architecture diagram", or "system diagram".
---

# drawio-diagram

Generate `.drawio` architecture diagrams with a consistent visual style. Always include a legend. Supports export to PNG, SVG, PDF, and self-contained HTML.

## Workflow

1. **Understand the subject** — read source material (repos, docs, README, user description)
2. **Plan the diagram** — identify containers, capabilities, external services, and connections
3. **Generate the `.drawio` file** — use the XML structure and style conventions below
4. **Add a legend** — always include a legend row at the top of the diagram
5. **Export** — offer to export to PNG/SVG/PDF via draw.io CLI, or to self-contained HTML

## XML Structure

Every `.drawio` file must follow this structure:

```xml
<mxfile host="Electron" version="28.0.6">
  <diagram name="Page-1" id="unique-id">
    <mxGraphModel dx="1100" dy="760" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <!-- All diagram cells use parent="1" -->
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

For larger diagrams, increase `pageWidth` and `pageHeight` as needed (e.g., `1400x900` or `1600x1000`).

## Element Types and Styles

### Container (systems, layers, groupings)

Blue, rounded, bold title top-aligned.

```
rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;verticalAlign=top;fontSize=10;
```

### Capability (features, components, public)

Green, rounded, bold title with description.

```
rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;fontSize=10;verticalAlign=top;
```

### Existing / External (infrastructure, third-party)

Grey, rounded.

```
rounded=1;whiteSpace=wrap;html=1;fillColor=#f5f5f5;fontColor=#333333;strokeColor=#666666;verticalAlign=top;fontSize=10;
```

### Tech Preview (experimental, private, future)

Purple, rounded.

```
rounded=1;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;fontSize=10;verticalAlign=top;
```

### Process Step (automated actions, gates)

Orange, sharp corners.

```
rounded=0;whiteSpace=wrap;html=1;fillColor=#ffe6cc;strokeColor=#d79b00;fontSize=10;
```

### Use Case (domain applications, verticals)

Yellow, italic, pill-shaped.

```
rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;fontSize=10;verticalAlign=middle;fontStyle=2
```

### Outcome (key deliverable, result)

Dark green, white text. Use sparingly.

```
rounded=0;whiteSpace=wrap;html=1;fillColor=#008a00;strokeColor=#005700;fontColor=#ffffff;fontSize=10;
```

### Protocol Indicator (interface type)

Small circle, 8pt font.

```
ellipse;whiteSpace=wrap;html=1;aspect=fixed;fontSize=8;fontStyle=0
```

Size: 25x25.

### Annotation (ideas, notes, questions)

Sticky note shape, yellow.

```
shape=note;whiteSpace=wrap;html=1;backgroundOutline=1;fontColor=#000000;darkOpacity=0.05;fillColor=#FFF9B2;strokeColor=none;fillStyle=solid;direction=west;gradientDirection=north;gradientColor=#FFF2A1;shadow=1;size=20;pointerEvents=1;
```

### Region (soft grouping)

No fill, dashed border.

```
rounded=0;whiteSpace=wrap;html=1;dashed=1;fillColor=none;strokeColor=#999999;
```

### Infrastructure Bar

Full-width grey bar, typically at bottom.

```
rounded=1;whiteSpace=wrap;html=1;fillColor=#f5f5f5;strokeColor=#666666;fontColor=#333333;fontSize=10;
```

## HTML Labels

Use HTML in `value` attributes for rich text:

- Bold title: `<b>Title</b>`
- Line break: `<br>`
- Small text: `<font style="font-size: 9px;">text</font>`
- Combined: `<font><b>Title</b><br>Description</font>`

Standard element label pattern:

```
<font><b>Component Name</b><br>Brief description</font>
```

## Connections

Always use orthogonal edges:

```
edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;
```

Add labels on edges where the relationship needs clarification.

## Legend

Every diagram must include a legend row near the top. Use small pill-shaped elements (80x20) showing each element type used in the diagram:

```xml
<mxCell id="key-1" value="<span>Capability</span>" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;fontSize=10;verticalAlign=middle;fontStyle=2" vertex="1" parent="1">
  <mxGeometry x="20" y="40" width="80" height="20" as="geometry" />
</mxCell>
```

Space legend items 90px apart horizontally. Only include element types actually used in the diagram.

## Export

### draw.io CLI Export

```bash
# macOS
/Applications/draw.io.app/Contents/MacOS/draw.io -x -f png -e -b 10 -o output.drawio.png input.drawio

# Linux
drawio -x -f png -e -b 10 -o output.drawio.png input.drawio
```

Formats: `png`, `svg`, `pdf`, `jpg`

Key flags:
- `-x`: export mode
- `-f`: format
- `-e`: embed diagram XML in output
- `-b 10`: border width
- `-t`: transparent background (PNG only)

After export, the `.drawio` source can be deleted since the export embeds the XML.

### Self-Contained HTML Export

Generate a standalone HTML file that renders the diagram in a browser without draw.io installed:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>DIAGRAM_TITLE</title>
  <style>
    body { margin: 0; background: #f5f5f5; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
    .container { background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
  </style>
</head>
<body>
  <div class="container">
    <div class="mxgraph" style="max-width:100%;border:1px solid transparent;" data-mxgraph='{"highlight":"#0000ff","nav":true,"resize":true,"toolbar":"zoom layers lightbox","edit":"_blank","xml":"ESCAPED_XML_HERE"}'></div>
  </div>
  <script src="https://viewer.diagrams.net/js/viewer-static.min.js"></script>
</body>
</html>
```

To create the HTML:
1. Take the complete `<mxGraphModel>...</mxGraphModel>` XML from the `.drawio` file
2. XML-escape it for embedding in the `data-mxgraph` JSON attribute (escape `"`, `<`, `>`, `&`)
3. Replace `ESCAPED_XML_HERE` with the escaped XML
4. Replace `DIAGRAM_TITLE` with the diagram title

Open with `open output.html` (macOS) or `xdg-open output.html` (Linux).

## File Naming

- Source: `name.drawio`
- Exports: `name.drawio.png`, `name.drawio.svg`, `name.drawio.pdf`
- HTML: `name.drawio.html`

## Layout Guidelines

- Place legend at top
- Use containers to group related components
- Infrastructure bar at bottom
- External services on the right side
- Process flows left-to-right
- Annotations (sticky notes) in margins
- Leave adequate spacing between elements (20-30px minimum)

## Reference

See `references/` in this skill directory for:
- `demo.drawio` — example output with all element types
- `xml-and-export.md` — detailed XML structure and CLI reference
