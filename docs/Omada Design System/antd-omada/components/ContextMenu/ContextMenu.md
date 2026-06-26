# ContextMenu

The right-click menu pattern. Wraps any target so a context-menu gesture (right-click / long-press) opens the Omada dropdown surface positioned at the cursor, instead of the browser's native menu. Items reuse the antd menu-item shape; `onSelect(key)` fires on choose. A `selectable` target gets a focus ring for keyboard parity.

**Figma:** Dropdown 下拉菜单 `3:16099` — surface radius 6, soft shadow, 180×36 items, 20px leading icon + 8px gap, danger row red. Original right-click layer.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `{ key, label, icon?, danger?, disabled?, children? }[]` or `{ type:'divider' }` | — | menu model (icon = OmadaIcon name) |
| `onSelect` | `(key, info) => void` | — | fires on choose |
| `children` | node | — | the right-click target |
| `selectable` | `bool` | `false` | focus ring + `role="button"` + tabindex |
| `disabled` | `bool` | `false` | disables the trigger |
| `ariaLabel` | `string` | — | target label |
| `dropdownProps` | object | — | forwarded to antd Dropdown |

- Light + dark + i18n (en/zh) + RTL verified (antd mirrors placement under `direction=rtl`).
- Submenus supported via `children`; dividers via `{ type:'divider' }`.
