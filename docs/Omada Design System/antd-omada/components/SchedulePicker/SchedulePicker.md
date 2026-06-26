# SchedulePicker — `window.Omada.SchedulePicker`

A **week × hour drag-paint grid** for maintenance / access windows. Pick a state from the palette (Allow / Limit / Block by default), then click or drag across the 7 × 24 grid to paint it. One-click **presets** (always / work hours / nights + weekends / clear) and a human-readable **summary** ("Mon 09:00–18:00 · Allow") generated from the grid.

Distinct from **Schedule** — that is a boolean on/off grid. The SchedulePicker paints one of *several* states per cell (multi-tone heat grid), has an eraser, presets and a summary readout.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `states` | `[{ key, label?, cls?, color? }]` | allow / limit / block | The palette. `cls` maps to a built-in tone (`allow` green / `limit` orange / `block` red); `color` overrides freely. |
| `value` / `defaultValue` | `(string\|null)[7][24]` | empty | Cell = state key or `null`. |
| `onChange` | `(grid) => void` | — | Fires on every committed paint. |
| `presets` | bool | `true` | `false` hides the preset row. Presets paint with the active brush. |
| `summary` | bool | `true` | `false` hides the readout. |
| `disabled` | bool | `false` | — |

## Behaviour
- Click paints one cell; drag paints a stroke. Clicking a cell that already holds the active state **erases** it (toggle feel); the dedicated Erase chip paints `null`.
- Presets: *always* fills everything, *work hours* Mon–Fri 09–18, *nights + weekends* 22–06 + Sat/Sun, *clear* empties — all with the active brush state.
- Summary compresses each day into contiguous ranges with a state dot.
- Day labels reuse the `chart.d.*` keys; hour digits stay LTR in RTL while the grid mirrors.

## Figma
Node `31442:27257` ("Schedule 时间排程") defers to the external security component library — this multi-state control is original to the Omada library, on the semantic tones.
