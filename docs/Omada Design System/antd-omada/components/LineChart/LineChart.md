# LineChart — `window.Omada.LineChart`

Token-driven ECharts line / area / stacked-area chart.

**Library decision: ECharts** (`echarts@5.5.1` UMD). Chosen over `@ant-design/charts` because ECharts ships one self-contained UMD bundle with no React/peer-dependency entanglement, themes cleanly through a single option object (the §3 token-first contract), and coexists with the pinned React+Babel+antd UMD setup. All styling comes from `omada-chart-theme.js` (`omadaChartBase` + the accent ramp + `omadaLineFill`); the wrapper only maps `series`.

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `xData` | `string[]` | `[]` | category labels (pre-localized by caller) |
| `series` | `{name,data,color?}[]` | `[]` | one entry per line; `color` overrides the ramp slot |
| `variant` | `'line'\|'area'\|'stack'` | `'line'` | `area` = gradient fill (use ≤2 lines); `line` = solid 2px (use ≥3); `stack` = stacked areas @20%/24% |
| `smooth` | `bool` | `false` | straight segments per Figma |
| `legend` | `bool` | `true` | top-right roundRect legend |
| `height` | `number` | `260` | px |
| `yAxis` | `object` | – | merged into the value axis |
| `option` | `object` | – | escape hatch, shallow-merged last |

## Figma rules encoded
- Line ramp identical in light + dark: green `#05C178` · lime `#A6EF00` · blue `#0069CB` · magenta `#F476FF` · orange `#FF8C27` · red `#EE385C`.
- ≤2 lines → gradient fill `color@8%→0%` (light) / `@12%→0%` (dark).
- ≥3 lines → solid 2px lines, no fill.
- stacked → solid `color@20%` over `#FFF` (light) / `@24%` over `#1A1A1A` (dark).
- horizontal dashed gridlines only; no y-axis line.

Single calm 400ms `cubicOut` draw, no per-point stagger.

**Figma node:** `13973:7050` (Chart 图表–折线图), `536:13574` (types overview).
