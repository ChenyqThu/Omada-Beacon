# Transfer — `Omada.Transfer`

Thin wrapper over antd `Transfer` — the dual-list "shuttle" for moving devices between **Unassigned** ↔ **In this site**. Adds: 240×320 panels with a 6px radius, a quiet grey-50 header bar, OmadaIcon chevron arrows on the operation buttons, and `showSearch` on by default. `oneWay`, `showSelectAll`, `disabled` forwarded.

**Figma:** Transfer 穿梭框 (node `3:20324`) — 240×418 panels, 6px radius, border `#ECECEC`, 16px gap, grey header bar.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `dataSource` | `array` | — | `{ key, title, disabled? }[]`. |
| `targetKeys` | `string[]` | — | Keys currently on the right panel. |
| `render` | `fn` | — | `(item) => node` row renderer. |
| `showSearch` | `boolean` | `true` | Search both lists. |
| `operations` | `node[]` | OmadaIcon chevrons | `[toRight, toLeft]`. |
| `oneWay` | `boolean` | — | Hide the move-back arrow (in-row remove). |
| `titles` | `[node,node]` | — | Localize via `window.t()`. |
| `locale.searchPlaceholder` | `string` | — | Localize via `window.t()`. |

## Theming
- Panel width/height/radius, header & item heights → `omada-theme.js` `components.Transfer` (light + dark).
- Header bar bg + list radius → `omada-overrides.css` `.ant-transfer-list-header` / `.ant-transfer-list` (dark twins).

## i18n
- `titles` and `locale.searchPlaceholder` come from `window.t()`.
- The "N items / N selected" footer + select-all come from antd's `ConfigProvider locale` — don't re-translate.

## Do / Don't
- ✅ Keep panels content-sized; the wrapper sets sensible defaults via `listStyle`.
- ❌ Don't hard-code the header colour — the grey bar + dark twin live in the override layer.
