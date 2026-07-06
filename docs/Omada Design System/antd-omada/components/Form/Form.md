# Form — `Omada.Form`

Thin wrapper over **antd `Form`** with Omada defaults from the Figma "Form 表单" spec: **horizontal label-left** layout (flip `layout="vertical"` for drawers / narrow widths), **no colon**, a quiet `requiredMark="optional"`, and `scrollToFirstError`. Label height, item gap (18px) and the vertical label padding come from `omada-theme.js → components.Form`; the red required asterisk lives in `omada-overrides.css`.

`Form.Item`, `Form.List`, `Form.useForm`, `Form.useWatch`, `Form.useFormInstance`, `Form.ErrorList` and `Form.Provider` are re-attached so callers reach everything through `Omada.Form`.

**Figma:** Form 表单-说明 — node `3000:104884` (structure, label-left layout, info-icon labels, Confirm/Cancel footer, validation-feedback section).

## Convenience props (on `Form`)
| Prop | Default | Notes |
|---|---|---|
| `layout` | `horizontal` | Set `vertical` for drawers / min-width reflow. |
| `requiredMark` | `optional` | antd renders "(optional)" on non-required items. |
| `colon` | `false` | Omada labels carry no colon. |
| `scrollToFirstError` | `true` | Jumps to the first failing field on submit. |
| *(all antd Form props)* | | `form`, `labelCol`, `onFinish`, … forwarded. |

## Rule presets — `window.OmadaFormRules`
Pass the current `t` so messages localise (en/zh):
```jsx
<Form.Item name="email" label={t('field.email')} rules={OmadaFormRules.email(t)} />
<Form.Item name="mtu" rules={OmadaFormRules.range(t, 576, 1500)} />
```
`required(t)` · `email(t)` · `ipv4(t)` · `minLen(t, n)` · `range(t, min, max)`.

## Do / Don't
- ✅ Use `Form.Item` `tooltip` for the info-glyph label seen in the Figma — antd renders the icon for you.
- ✅ Localise validation copy through the `OmadaFormRules.*(t)` presets, never hard-code English.
- ❌ Don't fix a control's width to its English label — Chinese is shorter, future locales longer.
