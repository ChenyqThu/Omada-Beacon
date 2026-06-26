# Gauge — `window.Omada.Gauge`

Token-driven ECharts gauge with two Omada styles.

**Library:** ECharts `echarts@5.5.1` UMD — see `LineChart.md`.

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `number` | `0` | current value |
| `max` | `number` | `100` | scale max |
| `variant` | `'progress'\|'zoned'` | `'progress'` | see below |
| `label` | `string` | `''` | caption under the value |
| `unit` | `string` | `'%'` | appended to the value |
| `color` | `string` | green | progress arc colour (progress variant) |
| `bands` | `[stop,color][]` | red→orange→lime→green | zoned variant bands |
| `height` | `number` | `240` | px |
| `option` | `object` | – | escape hatch |

## Variants
- **progress** — a single rounded brand-green arc over a faint track (`splitLine` token), big centred value + caption. Use for health / utilisation. `color` overrides (e.g. orange for load).
- **zoned** — graded bands from the accent ramp (poor→fair→good→excellent) with a thin pointer. Use for signal quality.

270° sweep (`startAngle 220 → endAngle -40`), no tick clutter, single 400ms `valueAnimation` draw.

**Figma node:** `536:13574` (Chart types).
