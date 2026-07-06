# Form Patterns — `Omada.FormPatterns`

A **forms-patterns board** — the "how to compose a real form" companion to the
FormValidation board (which covers field *states*). This covers form *structure*:
the four decisions every Omada form makes. Built entirely from the real
`Omada.Form` + `Form.Item` + Omada inputs, so it doubles as a copy-paste
reference. Spec board, not a primitive.

## The four decisions

| Decision | Pattern |
|---|---|
| **Layout** | `vertical` (drawers / narrow) ↔ `horizontal` label-left (settings) ↔ `inline` (filter bars). Live segmented switch reflows one real form. |
| **Density** | One `ConfigProvider componentSize` (small / default / large). Never size fields one-by-one. |
| **Section grouping** | Chunk fields under quiet subheaders with a hairline — not one undifferentiated stack. |
| **Dependent fields** | A control that reveals/hides downstream fields via `Form.useWatch`. DHCP hides the static-IP block; **Static** reveals IP + Gateway. |

## Dependent-field recipe

```jsx
const [form] = Form.useForm();
const conn = AntForm.useWatch('conn', form);   // live value

<Form.Item name="conn" label="Connection">
  <Select options={connOpts} />
</Form.Item>
{conn === 'static' && (
  <Form.Item name="ip" rules={OmadaFormRules.ipv4(t)}>
    <Input placeholder="192.168.1.20" />
  </Form.Item>
)}
```

> `useWatch` re-renders only on that field's change — cheaper than `shouldUpdate`
> for a single dependency. Use `shouldUpdate` when many fields interact.

## Density recipe

```jsx
<ConfigProvider componentSize={size}>
  <Form layout={layout}> … </Form>
</ConfigProvider>
```

## Theming / i18n

Metrics (label height 32, item gap 18, vertical label padding) come from
`omada-theme.js → components.Form`; board chrome from `.omada-fp*` with dark
twins. All labels keyed under `fp.*` via `window.t()`; validation messages reuse
`OmadaFormRules`.

**Figma:** Form 表单-说明 node `3000:104884` (label-left layout, sectioning,
Confirm/Cancel footer).
