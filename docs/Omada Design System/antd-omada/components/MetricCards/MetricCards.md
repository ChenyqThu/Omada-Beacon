# MetricCards — `window.Omada.MetricCards` (+ `.Card`)

A KPI-card **cluster** for a dashboard header strip: a responsive grid of metric
tiles — leading tone icon + label, a big value(+unit), a comparison **delta**
(green up / red down + "vs last period"), an optional inline **Sparkline**, and
an optional **range** footer (min–max or target). A shared, optional range
`Segmented` switcher sits above the grid.

## Props

| Prop | Type | Notes |
|---|---|---|
| `metrics` | `[Metric]` | The tiles (see below) |
| `title` | node | Optional strip title |
| `ranges` | `[{ value, label }]` | Renders a Segmented range switcher; omit to hide |
| `range` / `onRangeChange` | string / fn | Active range + change handler |
| `minTile` | number | Min tile width before reflow (default 210) |
| `compact` | bool | Tighter tiles |

**Metric**: `{ key, label, value, unit?, icon?, tone?, delta?, vs?, spark?,
range?, rangeText?, goodWhenDown? }`

- `delta`: `{ dir: 'up'|'down'|'flat', value }` — colour from semantic
  success/error tokens; `flat` reads grey.
- `goodWhenDown`: flips the delta colour sense for metrics where lower is better
  (latency, errors, alerts).
- `spark`: `[number]` → embedded `OmadaSparkline`, tone tracks the delta sense.
- `range`: `{ min, max, unit? }` → "min – max unit" footer, or pass `rangeText`.
- `tone`: colours the icon chip (`brand · blue · magenta · orange · red`).

## Behaviour

- Grid auto-fits (`minmax(minTile, 1fr)`) and reflows to one column on narrow.
- The range Segmented is presentational — wire `onRangeChange` to refetch.
- RTL-safe.

## Tokens / CSS

Card surface, icon chip tones, delta, value scale, sparkline slot and footer
live in `omada-overrides.css` under `.omada-mc*` with a `[data-omada-theme="dark"]`
twin. Delta/semantic colours come from antd tokens — no hard-coded brand hex in
the JSX.

Figma: KPI tile language — Statistic 统计数值 (no dedicated node) extended into a
comparison card.
