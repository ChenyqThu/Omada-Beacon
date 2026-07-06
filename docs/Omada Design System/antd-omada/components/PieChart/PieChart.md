# PieChart — `window.Omada.PieChart`

Token-driven ECharts pie / donut.

**Library:** ECharts `echarts@5.5.1` UMD — see `LineChart.md`. Styling via the accent ramp + `omadaChartColors`.

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `data` | `{name,value,color?}[]` | `[]` | slices in ramp order |
| `variant` | `'donut'\|'pie'` | `'donut'` | donut radius `['58%','84%']` |
| `centerTitle` | `string` | – | donut centre total (e.g. `2.4 TB`) |
| `centerSub` | `string` | – | caption under the total (e.g. `TOTAL`) |
| `showLegend` | `'bottom'\|false` | `false` | ECharts circle legend at bottom |
| `height` | `number` | `240` | px |
| `option` | `object` | – | escape hatch |

The signature right-hand legend list (color dot · label · percent) seen in the
Figma "Association Classification" donut is rendered by the **caller** beside the
chart (see `PieChart.demo.jsx` → `LegendList`) — it stays out of the wrapper so
the chart sizes to its flex cell.

## Figma rules encoded
- Flat accent-ramp slices separated by a 2px surface-coloured stroke (gap reads in both themes).
- Donut slices use a 1.5° pad angle + 4px corner rounding; centred total + uppercase caption.
- Slice labels off (legend carries them); tooltip = `name: value (percent%)`.

Single 400ms `cubicOut` draw.

**Figma node:** `536:13574` (Chart 图表（类型）饼/环图).
