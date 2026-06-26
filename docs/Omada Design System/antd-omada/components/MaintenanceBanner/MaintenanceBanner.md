# MaintenanceBanner — `window.Omada.MaintenanceBanner`

A **scheduled-window announcement bar with a live countdown**. Give it the maintenance window (`start` / `end`) and it manages its own phases:

| Phase | Tone | Readout |
|---|---|---|
| `upcoming` | info | "Starts in 2h 14m" (ticks each second) |
| `active` | warning + pulse | "In progress · ends in 41m 12s" |
| `done` | success | "Maintenance complete" |

Distinct from **Banner** (Batch 22 — a static persistent announcement): this one is *time-driven* — it re-tones itself as the window arrives and shows the absolute window alongside.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `start` / `end` | epoch ms \| Date | — | The window. |
| `title` | string | t(maintb.title) | — |
| `message` | string | — | Body line (hidden once done). |
| `actions` | node | — | Trailing slot (e.g. a Details button). |
| `dismissible` | bool | `true` | × hides it for the **current phase**; it reappears on phase change. |
| `onDismiss` | `(phase) => void` | — | — |
| `onPhaseChange` | `(phase) => void` | — | Fires on upcoming → active → done transitions. |

## Behaviour
- Ticks once per second; countdown formats as `2d 4h` / `2h 14m` / `41m 05s` with localised unit suffixes.
- Window timestamps localise via `Intl` (`zh-CN` in Chinese); countdown digits stay LTR in RTL.
- Active phase shows a soft pulse dot on the countdown chip (no infinite-loop decoration elsewhere).

## Figma
No dedicated node — bar anatomy follows Banner / Alert; the phase machine + countdown chip are original.
