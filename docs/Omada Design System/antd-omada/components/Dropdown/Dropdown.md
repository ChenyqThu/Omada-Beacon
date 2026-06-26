# Dropdown — `Omada.Dropdown`

Thin wrapper over antd `Dropdown`. Defaults `trigger` to `['click']` and tags the overlay so the Omada surface styling applies.

**Figma:** Dropdown 下拉菜单 node `3:16099` — surface radius 6, shadow `0 3 10 rgba(29,37,41,0.2)`, item 180×36 / pad `7px 16px`, 20px leading icon + 8px gap, hover bg `#F4F4F4`, danger row red.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `menu` | `{ items, onClick?, selectedKeys? }` | — | antd data shape. `icon` via `OmadaIcon`, `{ type: 'divider' }` to group, `danger: true` for destructive, `children` for a submenu. |
| `trigger` | `string[]` | `['click']` | `['hover']` for nav-style menus. |
| `placement` | `string` | `bottomLeft` | e.g. `bottomRight` for row-action menus. |

`Omada.Dropdown.Button` is forwarded for the split primary + caret pattern.

## Visuals

Surface radius + item hover come from antd tokens; the tuned shadow comes from the `.ant-dropdown-menu` rule in `omada-overrides.css` (with a `[data-omada-theme="dark"]` twin). No new CSS this batch.

## Do / Don't

- ✅ Row-action menu: trigger from a `more-vertical` icon button, `placement="bottomRight"`.
- ✅ Mark destructive rows with `danger: true` (e.g. Forget / Delete).
- ❌ Don't put more than ~7 top-level items — group with dividers or a submenu.
