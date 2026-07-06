# BulkActions — `Omada.BulkActions`

A **selection action bar** over a data `Table`. antd Table gives you checkbox
selection but no place to **act** on it; this wraps `Table` with `rowSelection`
and floats a sticky toolbar in from the bottom the moment a row is checked —
"3 selected · Reboot · Move · Export · Forget". The everyday batch-ops pattern.

`window.Omada.BulkActions` · demo `window.OmadaDemos.BulkActions`

## Behaviour
- Check rows (or the header box) → the bar slides up with a live count + the
  action set; uncheck all → it slides away. `Esc` clears the selection.
- **Select all N / Clear** act across the whole `dataSource`, not just the
  visible page. A `danger` action is separated to its own group.
- Each action receives `(selectedRowKeys, selectedRows, clear)`; calling
  `clear()` empties the selection (e.g. after a successful batch op).

## Props
| Prop | Type | Notes |
|---|---|---|
| `columns` / `dataSource` / `rowKey` | antd Table props | Forwarded. |
| `actions` | `[{ key, label, icon?, danger?, onRun(keys, rows, clear) }]` | The bar buttons. |
| `selectedRowKeys` / `onSelectionChange` | controlled selection | Omit for internal state. |
| `…rest` | any Table prop | `pagination`, `size`, `scroll`, etc. forwarded. |

Strings via `window.t()` (`bulk.*`). Mount under `OmadaThemeProvider`.

## Tokens / styling
The floating bar surface, count chip, links and the green selected-row tint
(token `rowSelectedBg`) are theme-var driven with `[data-omada-theme="dark"]`
twins in `omada-overrides.css`. The bar slides via the §0 motion token.
Mirrors under RTL. No hard-coded brand hex in the `.jsx`.

## Notes
- Still a thin Table wrapper — every Table prop is forwarded; the only addition
  is the managed `rowSelection` + the bar.
- For per-row (not batch) actions, use a `Dropdown` in a row-action column.

## Figma
Table selection language from `Table 表格` (page node `43:34741`) — the green
selected-row tint and the floating batch bar. Metrics/elevation from tokens;
glyphs are `OmadaIcon`.
