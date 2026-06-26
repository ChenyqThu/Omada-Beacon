# UndoToast

The "we did it, but you can take it back" snackbar. After a destructive or bulk action (delete, archive, move), an `OmadaUndoToast` bar pops up at the bottom of the app with a single **Undo** action and a thin progress hairline that ticks down toward auto-commit. Hovering pauses the countdown so the message stays readable; multiple actions stack (newest wins, capped by `max`). Set `duration={0}` for a sticky toast the user must explicitly Undo or dismiss.

Mount `OmadaUndoToast.Host` once near the app root, then enqueue from anywhere with the `useUndo()` hook or the imperative `OmadaUndoToast.push(...)`. **Undo** fires `onUndo` and removes the toast; expiry (or dismiss) fires `onCommit`. This is the global-undo affordance the Batch 22 plan left unbuilt.

**Figma:** derived from Message 全局提示 (toast surface) over the Dropdown elevated surface (`3:16099`). Original undo-affordance pattern.

## `useUndo()` → `{ push, clear }`

| `push(opts)` field | Type | Default | Notes |
|---|---|---|---|
| `message` | `ReactNode` | — | the line shown in the bar |
| `onUndo` | `() => void` | — | fired when Undo is clicked |
| `onCommit` | `() => void` | — | fired when the toast expires / is dismissed |
| `duration` | `number` (ms) | `6000` | `0` = sticky (no auto-commit) |
| `tone` | `'default' \| 'danger'` | `'default'` | danger tints the icon + bar red |
| `icon` | icon name | `'check-circle'` | leading glyph |
| `undoLabel` | `string` | `t('undo.undo')` | override the action label |

`clear(id)` removes a pending toast (e.g. the underlying record was committed elsewhere). `push` returns the toast id.

## `OmadaUndoToast.Host` props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `placement` | `'bottom' \| 'top'` | `'bottom'` | anchor edge |
| `max` | `number` | `3` | max stacked toasts (oldest dropped) |

- Light + dark + i18n (en/zh) + RTL verified.
- `role="status"` / `aria-live="polite"`; Undo and dismiss are ≥ 32 px hit targets; countdown pauses on hover for readability.
