# RowSelection

Keyboard- and range-aware selection layer over the Omada Table. Adds spreadsheet gestures antd's built-in `rowSelection` lacks: click to select, **Shift-click / Shift+↑↓** to extend a contiguous range from an anchor, **⌘/Ctrl-click** to toggle one, **⌘/Ctrl+A** to select all, **Esc** to clear. A focusable wrapper owns a roving "active" row that ↑/↓ move and Space toggles. A sticky bar shows the count + bulk actions when anything is selected; a quiet hint teaches the gestures otherwise.

**Figma:** derived from Table 表格 row-action states `24381:129437` + the Dropdown bulk-action pattern (`3:16099`). Original interaction layer.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `columns` | antd `ColumnsType` | — | forwarded to Table |
| `dataSource` | `object[]` | `[]` | rows |
| `rowKey` | `string \| fn` | `'key'` | row identity |
| `selectedKeys` | `Key[]` | — | controlled selection |
| `defaultSelectedKeys` | `Key[]` | `[]` | uncontrolled seed |
| `onChange` | `(keys) => void` | — | fires on any selection change |
| `bulkActions` | `{ key, label, icon?, danger?, onClick(keys) }[]` | `[]` | buttons in the sticky bar |
| `size` | `'small'\|'middle'\|'large'` | `'middle'` | Table density |

- Light + dark + i18n (en/zh) + RTL verified.
- Hit targets ≥ 32px; wrapper has a visible focus ring; rows expose `role="grid"` / `aria-multiselectable`.
