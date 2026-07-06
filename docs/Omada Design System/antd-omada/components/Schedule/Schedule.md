# Schedule — `Omada.Schedule`

A weekly time-block selector (7 days × 24 hours) — the classic Omada schedule grid used for Wi-Fi / PoE / security time ranges.

**Figma:** Schedule 时间排程 node `18482:461`. The page defers to the security component library ("见安防组件库 Schedule 时间排程"), so this is an **original Omada-styled control** — brand-green active cells, grey idle, click-or-drag to paint.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` / `defaultValue` | `boolean[7][24]` | empty grid | Row = day, col = hour. |
| `onChange` | `(grid) => void` | — | Fires on every paint. |
| `days` | `string[]` | `t('chart.d.*')` Mon–Sun | Row labels. |
| `hours` | `number` | `24` | Columns. |
| `disabled` | `boolean` | `false` | |

## Interaction

- Click a cell to toggle; **drag** to paint a run (the drag adopts the inverse of the first cell's state).
- **Select all** / **Clear** actions in the toolbar.
- Cells are `role="checkbox"` with `aria-checked` + an hour `aria-label`.

## Visuals

All colour is token-/var-driven via `omada-overrides.css` (`.omada-schedule*`, + dark twin): active cell = the Omada green var, idle = neutral, every 2-hour column gets a heavier gridline (`.is-major`). No hard-coded brand hex in the JSX.

## Do / Don't

- ✅ Seed a pattern (e.g. business hours) as `defaultValue`; read changes via `onChange`.
- ✅ Use `disabled` for a read-only schedule preview.
- ❌ Don't rebuild this as 168 checkboxes — the drag-paint grid is the whole point.
