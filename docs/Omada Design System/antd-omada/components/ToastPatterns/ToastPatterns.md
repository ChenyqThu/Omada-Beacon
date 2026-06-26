# ToastPatterns — 反馈模式

A **feedback-pattern board**, not a primitive. It demonstrates the four toast
patterns that recur in product, all fired through the antd-6 `App.useApp()`
context (`window.Omada.useMessage` / `useNotification`) so every toast inherits
the active Omada theme, locale and direction.

`window.Omada.ToastPatterns` · demo `window.OmadaDemos.ToastPatterns`

## Patterns shown
| # | Pattern | Mechanic |
|---|---------|----------|
| 1 | **Promise toast** | one reused `key` transitions `loading → success/error` in place — the spinner is replaced, not stacked |
| 2 | **Queue & throttle** | `maxCount: 3` (message) / `4` (notification) caps the stack; a 6-toast burst collapses the oldest |
| 3 | **Action toast** | a notification with `btn` (Undo / Confirm) + a stable `key` so the action can dismiss its own notice |
| 4 | **Placement** | fires a notification to the chosen corner; mirrors correctly under RTL |

## Props
Thin board — takes only `className` / standard div props. All feedback comes
from the App-context hooks; mount it under `OmadaThemeProvider` (which renders
`<App>`) so the hooks resolve.

## Notes
- Built entirely on existing wrappers (`Message`, `Notification`, `Button`,
  `Segmented`); no new colour or token.
- The promise pattern guards re-entry with a ref so the loading toast can't be
  double-fired.
- Defaults (top offset, maxCount, duration) come from `OMADA_MESSAGE` /
  `OMADA_NOTIFICATION` in `components/App/App.jsx`.

## Figma
No dedicated node — this is an antd-6 feedback **architecture** board. The
toasts it fires are the Message (node `2965:16331`) and Notification (node
`29197:52977`) wrappers, already matched to their Figma nodes.
