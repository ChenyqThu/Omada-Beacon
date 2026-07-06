# Table Patterns — `Omada.TablePatterns`

A **tables-patterns board** — the composition companion to the `DataTable`
wrapper (which covers sort / select / filter / dense). `DataTable` is the
everyday table; this board shows the four heavier antd `Table` features the
product needs, all on **one** real table so they're seen working together.
Spec board, not a primitive.

## The four patterns

| Pattern | How |
|---|---|
| **Sticky header** | `sticky` + `scroll={{ y: 240 }}` — header pinned while the body scrolls, for long device rosters. |
| **Expandable rows** | `expandable.expandedRowRender` — a per-row detail strip (MAC / IP / uptime) without leaving the table. |
| **Summary row** | `Table.Summary` with `fixed` — totals clients & traffic, recomputed live from the row data. |
| **Editable cells** | Click the **clients** cell → inline `InputNumber`; commit on Enter / blur, cancel on Esc. Local state, no server. |

## Editable-cell recipe

```jsx
function EditCell({ value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  if (editing) return (
    <InputNumber autoFocus value={val} onChange={setVal}
      onPressEnter={() => { setEditing(false); onChange(val); }}
      onBlur={() => { setEditing(false); onChange(val); }}
      onKeyDown={e => e.key === 'Escape' && setEditing(false)} />
  );
  return <button onClick={() => setEditing(true)}>{value} ✎</button>;
}
```

## Summary recipe

```jsx
summary={() => (
  <Table.Summary fixed>
    <Table.Summary.Row>
      <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
      <Table.Summary.Cell index={2} align="right"><strong>{total}</strong></Table.Summary.Cell>
    </Table.Summary.Row>
  </Table.Summary>
)}
```

## Theming / i18n

Header bg, row hover/selected, cell padding all come from
`omada-theme.js → components.Table`; status via `Omada.StatusPill`; board chrome
from `.omada-tp*` with dark twins. Column headers + chrome keyed under `tp.*` via
`window.t()`; numbers formatted with `toLocaleString(zh-CN | en-US)`.

**Figma:** Table 表格 family — header / zebra / row-action metrics encoded in
`components.Table`. Expand chevron, summary emphasis and inline-edit affordance
are antd Table features against those tokens.
