# EditableField

Inline click-to-edit for a single value — the lightweight alternative to opening a form just to rename a device or change one setting. Display mode shows the value with a quiet pencil affordance on hover; clicking swaps in the right control (text `Input`, `InputNumber`, or `Select`). The draft commits on **Enter / blur / ✓** and reverts on **Esc / ✕**. A `validate(value)` hook can block the commit and surface an inline error while staying in edit mode; empty values fall back to a muted "Not set".

**Figma:** Table 表格 inline-edit row `24381:129437` ("click Edit → editable state → Cancel reverts"). Original single-field distillation.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | any | — | current value |
| `type` | `'text'\|'number'\|'select'` | `'text'` | control in edit mode |
| `options` | `{ value, label }[]` | — | for `select` |
| `validate` | `(value) => string\|null` | — | return an error string to block commit |
| `onCommit` | `(value) => void` | — | fires only when the value changed |
| `min` / `max` | `number` | — | for `number` |
| `suffix` | node | — | unit shown after the display value |
| `placeholder` / `emptyText` | `string` | — | edit hint / empty fallback |
| `width` | `number` | type default | edit-control width |
| `disabled` | `bool` | `false` | display-only |

- Light + dark + i18n (en/zh) + RTL verified.
- Autofocuses (and selects, for text) on enter-edit; ✓/✕ use `mousedown` preventDefault so blur-commit doesn't race the click.
