# FirmwareRollout — `window.Omada.FirmwareRollout`

A **staged firmware-rollout tracker**. A rollout advances through ordered waves (lab ring → canary → regional → all sites); each wave shows device count, live progress and state, with per-wave pause / resume / retry. A failed wave blocks the waves after it.

Distinct from **UploadQueue** (per-file transfer queue) and **Steps** (static navigation): this is an operational fleet-progress surface with per-wave control.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `version` | string | — | Firmware version, rendered as a mono chip. |
| `waves` | `[{ id, name, devices, progress, state }]` | `[]` | `state: 'done' \| 'active' \| 'paused' \| 'queued' \| 'error'`. |
| `onAction` | `(id, 'pause'\|'resume'\|'retry') => void` | — | Wire to your rollout controller; the component is presentational. |
| `className` | string | — | Forwarded. |

## Behaviour
- Header shows a **device-weighted** overall % and `n of m waves complete`; any error wave flips the overall bar to exception tone.
- Queued waves *after* an error wave render with a blocked tint (rollout halted).
- Active wave shows a soft live dot; paused waves grey their bar.
- Numbers/percentages stay LTR in RTL.

## Figma
Sidebar icon SYMBOLs `36:30515` ("图标=Firmware"), `25947:9682` (Off) / `27066:119181` (On) — no full rollout frame exists in the file; anatomy follows the Steps / Progress tokens and the UploadQueue row precedent.
