# ChartEmpty — `Omada.ChartEmpty`

The Omada **chart empty-state pattern** (图表空状态) — *not* an illustration.
Per the Figma spec, a chart with no data shows **only its own frame** (axes,
gridlines and a ghost plot) dimmed to **~40% opacity**, with a short caption
centred over it. There is deliberately no spot illustration: the faded chart
skeleton *is* the empty state, so the empty/loading view stays visually
continuous with the populated chart (same axes, same footprint).

Use it as the empty (and optionally loading) state for any LineChart /
BarChart / PieChart panel.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `type` | `'line' \| 'bar' \| 'pie'` | `'line'` | Which ghost frame to draw. |
| `title` | node | — | Chart card title (top-left). Omit for a frame-only card. |
| `caption` | node | `t('chart.empty.title')` | Centred headline. |
| `hint` | node | `t('chart.empty.hint')` | Centred sub-text. Pass `null` to hide. |
| `loading` | `boolean` | `false` | Loading caption + gentle pulse instead of "no data". |
| `height` | `number` | `240` | Frame height in px. |
| `opacity` | `number` | `0.4` | Frame dim level (the spec value). |
| `showCaption` | `boolean` | `true` | Set `false` for a bare 40% frame (e.g. behind a Spin). |

## Theming

Axis / grid / ghost-plot / surface / caption colours come from theme CSS vars
in `omada-overrides.css` (`.omada-chart-empty*`), each with a
`[data-omada-theme="dark"]` twin. The `40%` dim is applied to the whole SVG
frame so it reads identically in both themes. No brand hex in the JSX.

## i18n

`chart.empty.title` · `chart.empty.hint` · `chart.empty.loading` — via
`window.t()`. Card titles in the demo use `chart.line` / `chart.bar` /
`chart.pie`.

**Figma:** Empty-Space 图表空状态 node `13644:14162` (page `43:34767`).
