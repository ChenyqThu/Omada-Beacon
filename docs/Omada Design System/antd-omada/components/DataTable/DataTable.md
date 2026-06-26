# DataTable — `Omada.DataTable`

Thin wrapper over **antd `Table`**. Presentational only — sorting, selection, filters, fixed columns, expandable rows and pagination are all native antd props passed straight through. Visuals come from `omada-theme.js → components.Table` (header bg/weight, row hover, **green selected row**, padding, 8px radius) plus a couple of header rules in `omada-overrides.css`.

**Figma:** Table 表格 — node group under `/Table` (`Table-Action`, `Hover`, dense rows).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `dense` | `boolean` | `false` | Maps to antd `size="small"` — the compact device-list density. Overridden by an explicit `size`. |
| `rowKey` | `string \| fn` | `"key"` | Set to your id field for real data. |
| `loading` | `boolean` | — | antd-native skeleton/spinner. |
| *(all antd Table props)* | | | `columns`, `dataSource`, `rowSelection`, `pagination`, `scroll`, `expandable`, … forwarded. |

Statics re-exposed: `DataTable.Column`, `.ColumnGroup`, `.Summary`, `.SELECTION_ALL`, `.SELECTION_INVERT`, `.SELECTION_NONE`, `.EXPAND_COLUMN`.

## Conventions
- **Empty / "No data"** comes from antd via `ConfigProvider locale` — never re-translate it.
- Column **headers** and chrome (Dense, selection bar, Actions) go through `window.t()`.
- MAC / IP cells use the `.omada-mono` class.
- Status cells render `Omada.StatusPill`; row actions use `OmadaIcon` inside text `Button`s + a `Dropdown` more-menu.

## Do / Don't
- ✅ `<DataTable dense columns={cols} dataSource={rows} rowSelection={sel} />`
- ❌ Don't hard-code header colours or row-selected green — they're tokens.
