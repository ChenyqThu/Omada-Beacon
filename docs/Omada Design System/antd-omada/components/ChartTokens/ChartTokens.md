# Chart Tokens — `Omada.ChartTokens`

A **data-viz token board** — the chart-side companion to ColorTokens / Elevation.
It renders `omada-chart-theme.js` **live** so the documented chart language can
never drift from what ECharts actually paints. This is a spec board, not a
primitive.

## What it shows

| Section | Source (live) |
|---|---|
| **Accent ramp** | `window.OMADA_CHART_RAMP.byName` — green → lime → blue → magenta → orange → red (+ grey), in spec order. Identical across light/dark by Figma rule. Click a chip to copy the hex. |
| **Fill rules** | Real `Omada.EChart` mini-previews built from `omadaChartBase` + `omadaLineFill`: ≤2 lines → **gradient**, ≥3 lines → **solid** no-fill, stacked → **solid @ stackPct**. |
| **Structural tokens** | `omadaChartColors(mode)` → axis / split / text / tooltip colours. Per-mode values are read, not guessed. |

## The chart language (from `omada-chart-theme.js`)

```
ramp        green #05C178 · lime #A6EF00 · blue #0069CB
            magenta #F476FF · orange #FF8C27 · red #EE385C   (+ grey #CCCCCC)
≤2 lines    gradient fill  color@8%→0% (light) / @12%→0% (dark)
≥3 lines    solid 1.2–1.4px lines, no fill
stacked     solid fill  color@20% (light) / @24% (dark)
grid        horizontal dashed splitLines only — no vertical grid, no y-axis line
motion      single 400ms cubicOut draw, no per-point stagger
```

## Usage

```jsx
const { ChartTokens } = window.Omada;
<ChartTokens />   // reads mode/lang from useOmada(); no props needed
```

Build a real chart from the same source:

```jsx
const opt = window.omadaChartBase(mode, lang, { xData });
opt.series = [{ type: 'line', areaStyle: { color: window.omadaLineFill(color, mode, 'gradient') }, data }];
<Omada.EChart option={opt} />
```

## Theming / i18n

All swatch values come from the chart-theme module; surfaces are theme vars with
dark twins (`.omada-cvt*`). Labels are keyed under `cvt.*` via `window.t()`.

**Figma:** ramp + rules transcribed in `omada-chart-theme.js` from
**Chart 图表–折线图** (node `13973:7050`) and **Chart 图表（类型）** (node `536:13574`).
