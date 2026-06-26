# DataExplorer — `window.Omada.DataExplorer`

A three-pane **data explorer**: a facet rail (left) + a themed table (center) +
a detail preview (right). The "browse a fleet" surface — narrow with checkboxes,
scan the table, inspect one row.

## Props

| Prop | Type | Notes |
|---|---|---|
| `facets` | `[{ key, label, options:[{ value, label, count? }] }]` | Collapsible checkbox groups in the rail |
| `columns` | antd Table columns | Center table columns |
| `rows` | `[object]` | Row data |
| `rowKey` | string | Row id field (default `key`) |
| `renderPreview` | `(row) => node` | Right-pane content; defaults to a column key/value dump |
| `previewTitle` | `(row) => node` | Preview header title |

## Behaviour

- Checking facet options filters `rows` — **AND across facets, OR within a
  facet** — matching `row[facet.key]` against the checked values. A rail header
  shows the active-filter count with **Clear all**.
- Rows are single-select on click; the chosen row opens the preview pane and
  gets a highlighted row class. A live **"N of M items"** count sits above the
  table.
- Empty preview shows an `OmadaIllustration` "no-results" cue with a hint.
- Responsive: the preview pane collapses under a width breakpoint (table goes
  full width) and the rail narrows; RTL-safe.

## Tokens / CSS

The rail, facet rows, result bar, active-row highlight, preview card and empty
state live in `omada-overrides.css` under `.omada-dx*` with a
`[data-omada-theme="dark"]` twin. Table colours come from the `Table` theme
tokens; no hard-coded brand hex in the JSX.

Figma: multi-pane browse pattern — composes Table 表格 + the Tree/Filter facet
language; no single node. Original layout.
