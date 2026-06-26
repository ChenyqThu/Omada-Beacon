# BarChart — `window.Omada.BarChart`

Token-driven ECharts bar chart (column / horizontal bar / grouped / stacked).

**Library:** ECharts `echarts@5.5.1` UMD — see `LineChart.md` for the rationale. All styling via `omadaChartBase` + the accent ramp; the wrapper only swaps axis orientation and maps `series`.

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `xData` | `string[]` | `[]` | category labels |
| `series` | `{name,data,color?}[]` | `[]` | one entry per group; grouped automatically when >1 |
| `variant` | `'column'\|'bar'` | `'column'` | `bar` = horizontal (value↔category axes swap) |
| `stack` | `bool` | `false` | stack all series into one bar |
| `legend` | `bool` | `true` | top-right legend |
| `barWidth` | `number` | auto | `barMaxWidth`; defaults 14 (>2 series) / 18 |
| `height` | `number` | `260` | px |
| `yAxis` | `object` | – | merged into the value axis |
| `option` | `object` | – | escape hatch |

## Figma rules encoded
- Slim flat bars, accent-ramp fills, lightly rounded outer corners (3px).
- Horizontal dashed gridlines only; no value-axis line; category axis line `#ECECEC`/`#333`.
- Shadow axis-pointer on hover; `axis` tooltip trigger.
- Stacked: only the top-most segment keeps rounded corners.

Single 400ms `cubicOut` draw.

**Figma node:** `536:13574` (Chart 图表（类型）柱状图/条形图).
