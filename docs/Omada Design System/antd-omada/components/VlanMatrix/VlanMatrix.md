# VlanMatrix — `window.Omada.VlanMatrix`

A **port × VLAN membership paint grid**: VLAN rows (id chip + name) × port columns. Click cycles a cell excluded → **U**ntagged (solid green) → **T**agged (outlined); pointer-drag paints the value chosen by the initial click. Invariant: **one untagged VLAN per port** — painting U clears that port's previous U.

Distinct from **SchedulePicker** (Batch 25 — week×hour time-range paint) and **PortPanel** (Batch 25 — physical port status): this edits logical membership.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `vlans` | `[{ id, name }]` | `[]` | Rows. |
| `ports` | number | `16` | Columns. |
| `defaultValue` | `{ [vlanId]: { [port]: 'u' \| 't' } }` | `{}` | Absent = excluded. |
| `onChange` | `(value) => void` | — | Fires on every paint. |

## Behaviour
- Cells are real `<button>`s with localized aria labels; Tooltip shows VLAN · port · state.
- The grid keeps LTR port order in RTL (like code/diff panes); horizontal scroll on narrow viewports.

## Figma
Icon SYMBOL `25947:12266` ("Property 1=vlan wizard") — no full frame; cell metrics follow SchedulePicker.
