# TextArea — `Omada.TextArea`

Thin wrapper over **antd `Input.TextArea`**. Omada default: `autoSize={{ minRows: 3, maxRows: 6 }}` so the field grows with content instead of scrolling. 4px radius and focus ring inherited from the Input tokens (`omada-theme.js → components.Input`). Pass `autoSize={false}` for a fixed box.

**Figma:** Input 输入框 — the multiline / 文本域 variant shares the Input spec.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `autoSize` | `boolean \| {minRows,maxRows}` | `{3,6}` | `false` for a fixed `rows` box. |
| `showCount` | `boolean` | `false` | Pair with `maxLength` for a counter. |
| `maxLength` | `number` | — | Caps input length. |
| *(all antd TextArea props)* | | | `rows`, `value`, `onChange`, … forwarded. |

## Do / Don't
- ✅ Leave `autoSize` on for notes / descriptions so the box fits the text.
- ✅ Add `showCount` + `maxLength` when there's a hard limit, so the user sees remaining room.
- ❌ Don't use `Omada.Input` for multi-line content — TextArea handles wrapping and resize.
