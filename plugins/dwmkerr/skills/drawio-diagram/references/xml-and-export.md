# XML Format and Export Reference

## XML Structure

Every `.drawio` file must have this structure:

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

## Style Property Reference

| Property | Values | Use for |
|----------|--------|---------|
| `rounded=1` | 0 or 1 | Rounded corners |
| `whiteSpace=wrap` | wrap | Text wrapping |
| `html=1` | 1 | Enable HTML in labels |
| `fillColor=#dae8fc` | Hex color | Background color |
| `strokeColor=#6c8ebf` | Hex color | Border color |
| `fontColor=#333333` | Hex color | Text color |
| `fontSize=10` | number | Font size in px |
| `fontStyle=2` | 0=normal, 1=bold, 2=italic, 3=bold+italic | Font style |
| `verticalAlign=top` | top, middle, bottom | Vertical text alignment |
| `shape=note` | shape name | Sticky note shape |
| `ellipse` | style keyword | Circles/ovals |
| `aspect=fixed` | style keyword | Lock aspect ratio |
| `dashed=1` | 0 or 1 | Dashed lines |
| `edgeStyle=orthogonalEdgeStyle` | style keyword | Right-angle connectors |
| `shadow=1` | 0 or 1 | Drop shadow |

## Sticky Note Style

```
shape=note;whiteSpace=wrap;html=1;backgroundOutline=1;fontColor=#000000;darkOpacity=0.05;fillColor=#FFF9B2;strokeColor=none;fillStyle=solid;direction=west;gradientDirection=north;gradientColor=#FFF2A1;shadow=1;size=20;pointerEvents=1;
```

## HTML Labels

Use HTML in `value` attributes for rich text:

- Bold title: `&lt;b&gt;Title&lt;/b&gt;`
- Line break: `&lt;br&gt;`
- Small text: `&lt;font style=&quot;font-size: 10px;&quot;&gt;text&lt;/font&gt;`
- Underline: `&lt;u&gt;text&lt;/u&gt;`
- Combined: `&lt;font&gt;&lt;b&gt;Title&lt;/b&gt;&lt;br&gt;Description&lt;/font&gt;`

## draw.io CLI Export

### Locating the CLI

- **macOS**: `/Applications/draw.io.app/Contents/MacOS/draw.io`
- **Linux**: `drawio` (on PATH via snap/apt/flatpak)
- **Windows**: `"C:\Program Files\draw.io\draw.io.exe"`

### Export command

```bash
/Applications/draw.io.app/Contents/MacOS/draw.io -x -f <format> -e -b 10 -o <output> <input.drawio>
```

Key flags:
- `-x`: export mode
- `-f`: format (png, svg, pdf, jpg)
- `-e`: embed diagram XML in output (PNG, SVG, PDF only)
- `-o`: output file path
- `-b`: border width (default: 0)
- `-t`: transparent background (PNG only)
- `-s`: scale
- `-a`: all pages (PDF only)

### File naming

- Default: `name.drawio`
- Export: `name.drawio.png`, `name.drawio.svg`, `name.drawio.pdf`
- After export, delete the intermediate `.drawio` (the export contains embedded XML)

### Opening results

- **macOS**: `open <file>`
- **Linux**: `xdg-open <file>`
- **Windows**: `start <file>`

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| "Double hyphen within comment" | `--` inside XML comment | Remove double hyphens |
| Blank diagram | Invalid XML | Check structure, escaping |
| Export fails | CLI not found | Use full macOS path |
