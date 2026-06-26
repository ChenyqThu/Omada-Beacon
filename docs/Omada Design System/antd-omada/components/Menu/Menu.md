# Menu — `Omada.Menu`

Thin wrapper over antd `Menu` for the Omada side navigation. Defaults to inline (vertical) mode with the signature **left accent bar** on the selected row + brand-green label.

**Figma:** Sidebar 侧边导航栏 node `1198:20546` — rows `1198:1409` (off) / `1198:2078` (on, label `#00A870`); 216px sider, 36px rows, 20px leading icon, group titles + dividers.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `mode` | `'inline' \| 'vertical' \| 'horizontal'` | `'inline'` | Sidebar uses `inline`. |
| `inlineIndent` | `number` | `16` | Matches the Figma 16px row inset. |
| `items` | `MenuItem[]` | — | antd data shape. `{ type: 'group', label }` = section header, `{ type: 'divider' }` = rule. |
| `inlineCollapsed` | `bool` | — | Icon-only rail (64px). |
| `selectedKeys` / `openKeys` | `string[]` | — | Controlled selection / expansion. |

Plus all antd `Menu` props (forwarded).

## Helper

```js
window.omadaMenuItem(t, OmadaIcon, { key, icon, labelKey, beta, children, danger, disabled })
```
Builds one item: leading 18px `OmadaIcon`, localized label (`t(labelKey)`), optional `Beta` chip.

## Token / CSS split

- Metrics — `omada-theme.js → components.Menu` (itemHeight 36, itemPaddingInline 16, iconSize 18, activeBar width 2, groupTitleFontSize 11).
- Colours — per-mode theme (itemSelectedColor green, itemSelectedBg green@8%).
- **Left accent bar + full-bleed 0-radius rows** — `omada-overrides.css` (`.ant-menu-light.ant-menu-inline .ant-menu-item-selected::before`, with a `[data-omada-theme="dark"]` twin using `#16B981`).

## Do / Don't

- ✅ Group with `{ type: 'group' }` + `{ type: 'divider' }`; pass icons via the helper.
- ❌ Don't restyle the accent bar inline — it's the brand signature in CSS.
