# ComparisonTable — `window.Omada.ComparisonTable`

A side-by-side spec / plan / model comparison table. The **attribute column is sticky** so row labels stay anchored while many product columns scroll horizontally; the header row is sticky on vertical scroll. Distinct from **DiffView** (Batch 20 — before↔after of one thing) and **DataTable** (rows of records).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `attributes` | `Attribute[]` | `[]` | The rows. `{ key, label, group?, type?, unit?, hint?, render? }`. |
| `columns` | `Column[]` | `[]` | The compared things. `{ key, label, sublabel?, icon?, price?, highlight?, values }`. |
| `differencesToggle` | boolean | `true` | Show the "differences only" switch. |
| `defaultDifferencesOnly` | boolean | `false` | Start filtered to differing rows. |
| `attributeLabel` | string | — | Header of the sticky first column. |
| `recommendedLabel` | string | — | Ribbon text on the highlighted column. |
| `title` | string | — | Optional toolbar title. |

- `column.values` is a map keyed by attribute key.
- `attribute.group` clusters rows under a section header (consecutive same-group rows merge).
- `attribute.type: 'bool'` (or a boolean value) renders a green check / muted dash. `unit` is appended to scalar values. `render(value, column)` overrides a cell.
- `column.highlight: true` tints the column and shows the recommended ribbon.

## Usage

```jsx
<Omada.ComparisonTable
  attributes={[
    { group: 'Hardware', key: 'ports', label: 'LAN ports' },
    { group: 'Hardware', key: 'poe',   label: 'PoE',  type: 'bool' },
    { group: 'Perf',     key: 'tput',  label: 'Throughput', unit: ' Mbps' },
  ]}
  columns={[
    { key: 'a', label: 'ER605', price: '$69',  values: { ports: '5×', poe: false, tput: 940 } },
    { key: 'b', label: 'ER7212', price: '$199', highlight: true, values: { ports: '8×', poe: true, tput: 1500 } },
  ]}
/>
```

## Notes
- Dark twin, i18n, RTL-mirrored — the sticky edge and ribbon flip via logical properties.
- The "differences only" toggle hides rows where every column is equal (deep compare); a friendly "all identical" line shows if nothing differs.

## Figma
No dedicated node — built from the Table language (`样式对比`, `22587:5121` reference). The sticky-first-column comparison layout is original to the Omada library.
