# FormValidation — `Omada.FormValidation`

A **form-validation pattern board** capturing the visual rules from the Figma
`Form 表单` spec, where the `校验反馈` (validation feedback) section defines two
flows. It is *not* a new primitive — it composes the existing Omada `Form` /
`Input` wrappers and the shared `OmadaFormRules` presets.

## The two flows

| Flow | Figma | Behaviour |
|---|---|---|
| **Blur validation** | 失焦校验反馈 | Empty and format errors surface when a field loses focus, so users correct as they go — never only after submit. |
| **On submit** | 提交后校验反馈 | Submitting validates every field at once. |

## The two surfaces

1. **Field states** — one specimen per antd `validateStatus`
   (`success` · `warning` · `error` · `validating`), each with `hasFeedback`
   status icons and localized help text.
2. **Live blur validation** — a real form with `validateTrigger="onBlur"` whose
   fields use the `OmadaFormRules` presets (`minLen` · `ipv4` · `email`), so
   tabbing out of an empty or malformed field shows the error inline, and
   Apply validates everything. Reset clears it.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `className` | `string` | — | Extra class on the root. |

Composition-only — use `Omada.Form` + `Omada.Form.Item` + `OmadaFormRules`
directly to build real forms; this board documents the states they produce.

## Theming

The error control is a filled field with a `#EE385C` (token `colorError`)
border + a message below; success / warning / validating reuse antd's native
`validateStatus`, themed by the Omada semantic tokens in `omada-theme.js`
(`colorSuccess` / `colorWarning` / `colorError` + their `*Text` / `*Border`
variants, with dark twins). A small `.omada-formval*` layer in
`omada-overrides.css` only handles the specimen grid + hint, with a dark twin.

## i18n

`fv.states` · `fv.blurTitle` · `fv.blurDesc` · `fv.successMsg` · `fv.warnMsg` ·
`fv.validatingMsg`; reuses `valid.email` / `valid.ip` / `valid.minLen`,
`field.*`, `common.apply` / `common.reset` — all via `window.t()`.

**Figma:** `Form 表单` node `3000:104884` (校验反馈 section) + the `/Input2`
`Error` / `Done` / `Focus` state symbols.
