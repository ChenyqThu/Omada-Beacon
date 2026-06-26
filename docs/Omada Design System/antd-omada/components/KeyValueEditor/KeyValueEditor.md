# KeyValueEditor

Add / edit / remove / reorder a list of key→value pairs — the control behind custom HTTP headers, environment variables, DHCP options, tag maps and any "name = value" config. Each row is a grip handle (drag to reorder via native HTML5 DnD, ↑/↓ on a focused handle for keyboard reorder), a key `Input`, a value `Input`, and a remove button. "Add pair" appends a blank row and focuses its key. Empty keys are ignored on emit; duplicate keys get an inline error marker.

**Figma:** no dedicated node — built on the Input 输入框 + Button tokens and the SortableList (Batch 18) drag affordance. Original.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `{ key, value }[]` | — | controlled pairs |
| `defaultValue` | `{ key, value }[]` | `[]` | uncontrolled seed |
| `onChange` | `(pairs) => void` | — | emits the full array |
| `keyLabel` / `valueLabel` | `string` | i18n | column headers |
| `keyPlaceholder` / `valuePlaceholder` | `string` | i18n | input placeholders |
| `addLabel` | `string` | i18n | add-button label |
| `reorderable` | `bool` | `true` | show grip + enable drag |
| `size` | `'small'\|'middle'\|'large'` | `'middle'` | input density |

- Light + dark + i18n (en/zh) + RTL verified.
- Duplicate non-empty keys flag the input with `status="error"` + an inline "Duplicate key" note.
