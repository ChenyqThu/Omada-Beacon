# HeatCalendar — `window.Omada.HeatCalendar`

A **GitHub-style activity heat map**: weeks as columns × Mon–Sun rows, ending today. Cell intensity quantises each day's value into 5 levels of the brand-green ramp; hover shows `value · date` via Tooltip. Month labels mark month boundaries; a Less → More legend plus a localized total sit below.

Distinct from **SchedulePicker** (Batch 25 — an *editable* week × hour drag-paint grid): this is a *read-only* day × week density view.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `values` | `{ 'YYYY-MM-DD': number }` | `{}` | Event counts per day. |
| `weeks` | number | `26` | Columns rendered (last column contains today; future days are void). |
| `formatValue` | `(n) => string` | `'{n} events'` | Tooltip value text. |
| `onSelect` | `(dateISO, value) => void` | — | Click/keyboard observer; cells become focusable when set. |
| `className` | string | — | Forwarded. |

## Behaviour
- Levels: `0` empty, then 4 quantised steps of the green ramp scaled to the visible max.
- Weekday gutter labels Mon / Wed / Sun-style alternating; locale-formatted via `Intl`.
- The grid keeps LTR time order in RTL (like code/diff panes); container scrolls horizontally when narrow.

## Figma
No heat-map frame exists in the file (verified against the mount) — colours quantise the `OMADA.green` ramp; cell metrics follow SchedulePicker.
