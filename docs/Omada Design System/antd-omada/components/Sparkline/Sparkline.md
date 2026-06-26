# Sparkline — `window.Omada.Sparkline`

A tiny inline trend line for tables / stat tiles — no axes, grid, legend or labels.

**Library:** ECharts `echarts@5.5.1` UMD — see `LineChart.md`.

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `data` | `number[]` | `[]` | the series |
| `tone` | `'brand'\|'up'\|'down'\|'neutral'` | `'brand'` | maps to ramp: green / green / red / grey |
| `color` | `string` | – | explicit colour, overrides `tone` |
| `area` | `bool` | `true` | gradient wash under the line |
| `dot` | `bool` | `true` | end-point marker |
| `height` | `number` | `36` | px |
| `width` | `number` | `120` | px |
| `smooth` | `bool` | `true` | smoothed trend |

2px accent line, gradient fill reusing `omadaLineFill`'s gradient rule, single 400ms draw. Use inside KPI tiles (`Sparkline.demo.jsx`) or DataTable cells.

**Figma node:** `536:13574` (legend glyph / mini trend).
