# TrafficSparkline — `window.Omada.TrafficSparkline`

An inline **mini-trend row set** for tables — per-link / per-SSID traffic rows, each reading label · sparkline · current value · **Δ chip**, on one aligned grid so a column of trends scans like a table column. A **shared scale** toggle draws every row against the same max so magnitudes compare honestly.

Distinct from **Sparkline** (Batch 6) — that is one ECharts mini line for a stat tile. This is the table-row composition: a lightweight inline-SVG polyline per row (no chart instances — cheap for many rows), aligned readouts and automatic Δ tone.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `rows` | `[{ key, label, icon?, data: number[], unit?, format? }]` | `[]` | Current value = last datum. |
| `sharedScale` | bool | — | Controlled; otherwise the built-in toggle drives it. |
| `onSharedScaleChange` | `(bool) => void` | — | — |
| `toolbar` | bool | `true` | `false` hides the shared-scale toggle. |
| `flatBand` | number | `0.03` | |Δ| ≤ band renders as flat / neutral. |

## Behaviour
- Δ compares the last point to the first: rising → green chip + trend-up icon, falling → red, flat → neutral `±0%`.
- Shared scale normalises all rows to the global max (per-row max otherwise — each line fills its lane).
- Sparkline geometry stays LTR in RTL; labels/readouts mirror.

## Notes
- Stroke / area / dot colours come from CSS classes with dark twins — the SVG carries geometry only (hand-rolled SVG is in-scope for sparklines per the spec).

## Figma
Node `536:13574` (mini trend glyph) for the line language; the aligned row set is original.
