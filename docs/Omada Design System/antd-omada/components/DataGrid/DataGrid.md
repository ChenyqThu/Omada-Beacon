# DataGrid — `window.Omada.DataGrid`

A spreadsheet-style **editable grid**. Where TablePatterns demoed antd Table's
one-cell inline edit, this is the bulk-edit matrix: every editable cell is
keyboard-reachable, you type straight into it, and a dirty tracker + Save / Revert
bar sits beneath. The scaffold is a semantic `<table>`; each **editor** is a thin
antd control (Input / InputNumber / Select / Switch) so density, theme and locale
inherit.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `columns` | `Column[]` | `[]` | see below. |
| `rows` | `object[]` | `[]` | row data. |
| `rowKey` | `string` | `'key'` | stable id field. |
| `onChange` | `(rows, meta) => void` | — | fires on each commit. `meta = { rowKey, colKey, value }` or `{ revert:true }`. **Controlled** when present. |
| `onSave` | `(rows) => void` | — | fires from the Save bar; resets the dirty baseline. |
| `onRevert` | `(rows) => void` | — | fires from Revert. |
| `showFooter` | `boolean` | `true` | the dirty-status + Save/Revert bar. |

### Column

`{ key, title, type, width?, align?, editable?, options?, unit?, render?, validate? }`

- `type`: `'text' | 'number' | 'enum' | 'toggle'` — picks the editor + display.
- `editable: false` locks the column (shown with a lock glyph; skipped by edit-nav).
- `options`: `[{label, value}]` for `enum`.
- `validate(value, row) => string` — non-empty return paints the cell red and
  blocks the commit; Save is disabled while any error stands.

## Keyboard

`Click` / arrows select (green ring) · `Enter` / `F2` / start typing → edit ·
`Enter` commit + down · `Tab` / `Shift+Tab` commit + right / left · `Esc` cancel ·
`Space` toggles a boolean cell. Toggle cells flip in place — no edit mode.

## i18n

Chrome via `window.t()` under `dg.*` (verified en + zh). Column titles / options
passed in.

## Do / Don't

- **Do** validate destructive fields (IP, VLAN) so a bad bulk paste can't be saved.
- **Don't** use it for > ~200 rows unmemoised — pair with VirtualList for big sets.

## Figma

Editable Table-cell language from the device table (page **43:34741**) + Form
control metrics (**43:34720**). No branded art.
