# DiffViewer — `window.Omada.DiffViewer`

A line-level **text / config diff**. Give it two revisions of a config file, CLI dump or JSON and it renders a monospace diff with added / removed line highlighting, dual line-number gutters, a `+n / −n` stat readout and a **unified ⇄ split** toggle. Long unchanged runs collapse into an expandable "··· n unchanged lines" row.

Distinct from **DiffView** (Batch 20), which compares *field values* before↔after in a form-like layout — DiffViewer diffs raw text line by line (LCS), like a review pane.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `old` / `new` | string | — | The two revisions; diffed internally. |
| `oldLabel` / `newLabel` | string | Before / After | Pane / file labels in the header bar. |
| `mode` | `'unified' \| 'split'` | — | Controlled view mode. |
| `defaultMode` | same | `'unified'` | Uncontrolled start mode. |
| `onModeChange` | `(mode) => void` | — | Fires from the built-in toggle. |
| `toolbar` | bool | `true` | `false` hides the unified/split Segmented. |
| `context` | number | `3` | Unchanged lines kept around each change. |
| `collapse` | bool | `true` | `false` shows every unchanged line. |

## Behaviour
- LCS line diff computed internally — no pre-computed hunks needed; fine for config-sized inputs.
- Unchanged runs longer than `context × 2 + 3` collapse; clicking the fold row expands that run.
- Split view aligns each removed run with the added run beside it; one-sided rows get a blank twin.
- Identical inputs render a "No differences" note above the (all-context) pane.

## Notes
- Add/remove tints come from the semantic success / error tokens (12% washes), dark twins included.
- Code panes stay **LTR** in RTL locales (chrome strings still translate), like Inspector / CodeBlock.

## Figma
No dedicated node — diff colouring derives from the semantic success / error tokens; pane chrome follows CodeBlock (Batch 22).
