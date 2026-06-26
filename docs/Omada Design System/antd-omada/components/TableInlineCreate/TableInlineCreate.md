# TableInlineCreate — `window.Omada.TableInlineCreate`

The "+ Add row" affordance that lives at the foot of a table and expands, in place, into a typed editor row — for adding port forwards, DHCP reservations, firewall rules without a modal. Committed rows are **read-only display rows**; there is one collapsed add-affordance that opens an inline editor.

Distinct from **DataGrid** (Batch 20 — every cell edits, spreadsheet-style) and **FieldArray** (Batch 23 — an always-editable form-row group with no static display or collapsed add).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `columns` | `Column[]` | `[]` | Schema (below). Drives header, cell render, and the editor. |
| `value` / `onChange` | `Row[]` / fn | — | Controlled rows. Or `defaultValue` for uncontrolled. |
| `rowKey` | string | `'id'` | Identity field; auto-generated on create if absent. |
| `onCreate` | `(row) => void` | — | Fired after a row commits. |
| `onRemove` | `(key) => void` | — | Fired after a row is deleted. |
| `keepOpen` | boolean | `false` | Keep the editor open + refocus to add several in a row. |
| `removable` | boolean | `true` | Per-row trash button. |
| `max` | number | — | Disables Add once reached. |
| `addLabel` / `emptyText` | string | — | Localised labels. |

### Column

```js
{ key, title, type: 'text'|'number'|'select',
  required?, placeholder?, default?, width?, align?,
  options?,            // select: [{ value, label }]
  min?, max?, controls?, // number
  render?(value, row) } // custom display cell
```

`width` is `number` (px) or a CSS track string; omit for `1fr`. The editor row shares the same grid template, so inputs align pixel-perfect with the data cells.

## Behaviour
- **Enter / ✓** commits (validates required cells first; blocked cells flag inline). **Esc / ✕** cancels.
- Collapsed state is a full-width "+ Add {entity}" button.

## Notes
- Dark twin, i18n, RTL-mirrored (grid + action column flip via logical properties).
- Built as a CSS-grid table rather than wrapping antd `Table` so the inline editor never misaligns with data columns.

## Figma
No dedicated node — built from the Table language (`Table2`, `3:200xx` family). The inline-create affordance is original to the Omada library.
