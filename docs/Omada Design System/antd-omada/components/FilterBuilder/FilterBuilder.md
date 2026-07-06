# FilterBuilder — `Omada.FilterBuilder`

A compound **query builder**. antd has Select/Input but no multi-row filter
notion; this composes one: stack condition rows of `[field][operator][value]`,
join them with **ALL (AND) / ANY (OR)**, and surface the committed query as a
row of removable **chips** plus a compiled, copy-ready expression — the
"advanced filter" of a device or log table.

`window.Omada.FilterBuilder` · demo `window.OmadaDemos.FilterBuilder`

## Behaviour
- Each row picks a field; the operator set + value control adapt to the field
  **type**: `enum` → Select + is / is-not, `text` → contains / is / starts-with,
  `number` → `= > < ≥ ≤` + numeric input (with optional `unit` addon).
- Add / remove rows freely; the conjunction segmented flips AND ↔ OR (shown once
  there are ≥2 valid rows).
- Only **complete** rows (field + op + value) compile into chips + the
  expression; incomplete rows are ignored until filled. Removing a chip drops
  its row. `onChange({ conjunction, rows, valid })` fires on every edit.

## Props
| Prop | Type | Notes |
|---|---|---|
| `fields` | `[{ key, label, type, options?, unit? }]` | `type` ∈ `enum` / `text` / `number`. `options` = `[{label,value}]` for enum. |
| `defaultRows` | `[{ field, op, value }]` | Seed conditions. |
| `onChange` | `({ conjunction, rows, valid }) => void` | Compiled query, complete rows only. |

Strings via `window.t()` (`fb.*`). Mount under `OmadaThemeProvider`.

## Tokens / styling
Rows, the join words, chips and the compiled expression are theme-var driven
with `[data-omada-theme="dark"]` twins in `omada-overrides.css`; chips + the
expression use the brand-green token, and chips reuse the Tag radius. Mirrors
under RTL. No hard-coded brand hex in the `.jsx`.

## Figma
Filter language from the `Table 表格` toolbar (page node `43:34741`) + the Form
control metrics (node `43:34720`). Chips reuse the Tag corner radius; glyphs are
`OmadaIcon` (`sliders` / `plus` / `close`).
