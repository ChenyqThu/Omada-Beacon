# UploadQueue — `window.Omada.UploadQueue`

A multi-file **upload / firmware-push queue**. antd Upload owns one file list;
this is the heavier transfer surface for pushing firmware to a fleet or importing
a batch of configs — an aggregate progress header over per-file rows, each with
its own bar, status and pause / resume / retry / cancel controls.

Presentational + **controlled**: the parent owns the bytes (real XHR or a
simulation) and routes the action callbacks; this component renders and maps
status → colour + the right buttons. Thin over antd **Progress** + Omada
**Button / StatusPill / Icon**; the active bar uses brand-green, dark twins in
`omada-overrides.css`.

## Props

| Prop | Type | Notes |
|---|---|---|
| `items` | `Item[]` | `{ key, name, size, progress(0–100), status }`. `status ∈ queued · uploading · paused · done · error`. |
| `onPause / onResume / onRetry / onCancel` | `(key) => void` | per-row actions. Cancel on a `done` row removes it. |
| `onPauseAll / onResumeAll / onClear` | `() => void` | header bulk actions (auto-shown when relevant). |
| `onAdd` | `() => void` | shows the "Add files" trigger when present. |
| `title` / `addLabel` | `node` | header copy. |

Row action sets: `uploading` → Pause · `paused`/`queued` → Resume · `error` →
Retry · any incomplete → Cancel · `done` → Remove. Progress colour: active green ·
paused grey · success · exception.

## i18n

Chrome via `window.t()` under `uq.*` incl. `uq.st.<status>` (verified en + zh).

## Do / Don't

- **Do** keep one file uploading at a time for firmware (the demo promotes the
  next queued file when the slot frees) — concurrent flashes are risky.
- **Don't** drive progress inside this component — own it in the parent so it
  reflects real transfer state.

## Figma

Firmware-push / import progress language — `icon/upload` **25947:12326** + the
Firmware page-3 frame. Glyphs are OmadaIcon. No branded art.
