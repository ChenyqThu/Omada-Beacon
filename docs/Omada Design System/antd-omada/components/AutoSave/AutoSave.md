# AutoSave

The "your work is being kept" cue for auto-saving surfaces. A compact inline chip cycles **idle → saving → saved** (with a ticking "Saved 4s ago" timestamp) and surfaces two failure paths: **error** (with an inline Retry) and **conflict** (the record changed underneath you — an amber resolution bar offers Keep mine / Use theirs / Review changes). The component is presentational; `useAutoSave` is an optional companion hook that debounces a change and drives the status.

**Figma:** derived from Alert 警告提示 tone system (`3:25828`) + the Message status glyphs. Original status-cue pattern.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `status` | `'idle'\|'saving'\|'saved'\|'error'\|'conflict'` | `'idle'` | what the chip shows |
| `savedAt` | `number` (epoch ms) | — | drives the relative timestamp |
| `onRetry` | `() => void` | — | error-state action |
| `onResolve` | `(choice) => void` | — | `'mine'` / `'theirs'` / `'review'` |

**`useAutoSave(saveFn, { delay = 900 })`** → `{ status, savedAt, schedule(payload), retry(), setStatus }`. `saveFn` may return `'conflict'` to enter the conflict state, or throw/reject to enter error.

- Light + dark + i18n (en/zh) + RTL verified.
- Chip is `role="status" aria-live="polite"`; conflict bar is `role="alertdialog"`.
