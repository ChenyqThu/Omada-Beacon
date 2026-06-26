# Tree — `Omada.Tree`

Thin wrapper over antd `Tree` for the Omada site / device hierarchy. Adds: `blockNode` on by default (whole row is the hit target), an `OmadaIcon` chevron switcher (rotates on expand), green checkbox + green-50 selected tint. `Tree.DirectoryTree` is forwarded for the full-row file-manager style used by the site picker.

**Figma:** TreeSelect 树选择 page (node `43:34732`) — the dropdown tree shares node-row metrics: 32px rows, selected = green text + green-50 tint, chevron switcher.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `blockNode` | `boolean` | `true` | Full-width rows. Pass `false` for compact label-only hit area. |
| `switcherIcon` | `fn` | OmadaIcon chevron | Override to supply your own expander. |
| `checkable` | `boolean` | — | Green checkboxes (token `colorPrimary`). |
| `showIcon` | `boolean` | — | Use with per-node `icon: <Icon … className="omada-tree-icon"/>`. |
| …rest | — | — | All antd `Tree` props forwarded (`treeData`, `checkedKeys`, `onCheck`, `defaultExpandAll`, …). |

`Tree.DirectoryTree` — full-row highlight; pass `multiple` for multi-select.

## Theming
- Node height 32, selected/hover tint, `colorPrimary` → `omada-theme.js` `components.Tree` (light + dark).
- Node wrapper radius, leading-icon colour → `omada-overrides.css` `.ant-tree-node-content-wrapper` / `.omada-tree-icon` (dark twins present).

## Do / Don't
- ✅ Give every node a leading `OmadaIcon` with `className="omada-tree-icon"` for the device-type glyph.
- ✅ Localize titles via `window.t()`.
- ❌ Don't hard-code selected colours — they come from tokens so dark mode follows automatically.
