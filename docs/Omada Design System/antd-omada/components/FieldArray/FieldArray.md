# FieldArray

A repeatable group of form rows — the "add another" pattern for port forwards, static routes, DHCP reservations and firewall rules. A schema of typed columns (**text · number · select**) drives each row; an **Add** button appends one (from `newRow()`), a per-row trash removes it (down to `min`), and required cells flag inline when empty once `showValidation` is on. Fully controlled: `value` is an array of row objects, `onChange` returns the next array.

Not a `Form.List` clone — it stands alone (no Form context needed) so it drops into any panel, but its clean `value` / `onChange` also nest cleanly inside a `Form.Item`.

**Figma:** derived from Form 表单 repeatable-row group + Table 表格 add-row footer (the Table "Add" affordance). Original field-array composite.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `fields` | `Field[]` | `[]` | column schema (see below) |
| `value` | `object[]` | `[]` | the rows (controlled) |
| `onChange` | `(rows) => void` | — | fires on add / remove / edit |
| `newRow` | `() => object` | schema defaults | factory for an appended row |
| `min` / `max` | `number` | `0` / `∞` | row-count bounds (gate trash / Add) |
| `showValidation` | `boolean` | `false` | when true, empty required cells turn red |
| `addLabel` | `string` | `t('fa.add')` | Add button text |
| `showHead` | `boolean` | `true` | column-label header row |

**Field** = `{ name, label, type, placeholder?, required?, width?, options?, min?, max?, step?, maxLength? }` where `type` is `'text' \| 'number' \| 'select'` and `width` is any CSS grid track (e.g. `'110px'`).

- Light + dark + i18n (en/zh) + RTL verified.
- Inputs forward antd `status="error"`; trash is a 36 px focusable control disabled at `min`.
