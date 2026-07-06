# Divider — `window.Omada.Divider`

Thin wrapper over antd `Divider`. The line colour is the `Divider.colorSplit`
token (#ECECEC light / #333 dark); the with-text label is restyled to the
Omada spec (12px, #999) via `.omada-divider` in `omada-overrides.css`.

## Forwarded antd props

| prop | values |
|---|---|
| `type` | `horizontal` (default) · `vertical` |
| `orientation` | `left` · `center` (default) · `right` — label position |
| `dashed` | boolean |
| `plain` | boolean — lighter label weight |
| `size` | spacing preset |

Children become the inline label.

```jsx
<Divider />
<Divider orientation="left">Basic</Divider>
<Divider type="vertical" />
```

## Do / Don't
- **Do** use a plain `<Divider/>` under a card sub-heading; in config forms keep it the same width as the content area.
- **Don't** stack multiple labelled dividers in dense lists — use spacing instead.

## Figma
- `Driver 分割线` — node **141:1951** (light) · **3:15830** (dark).
- Spec: 1px line, #ECECEC; with-text label #999999 / Manrope 12px.
