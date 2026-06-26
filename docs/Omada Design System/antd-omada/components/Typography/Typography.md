# Typography — `window.Omada.Typography`

Thin wrapper over antd `Typography`. Re-exports the statics under
`window.Omada.*` for ergonomic use: `Title`, `Text`, `Paragraph`, `Link`.
Family, weight, size and colour all come from the seed tokens
(`fontFamily`, `fontSizeHeading1–5`, `colorText`/`Secondary`/`Tertiary`), so
light + dark map automatically with no per-component CSS.

## Type system (from Figma)

| token | value |
|---|---|
| family | Manrope → PingFang SC → Microsoft YaHei |
| weights | Regular 400 · Medium 500 · Semibold 600 |
| sizes | heading 36 / 24 / 20 / 16 / 14 · body 22 / 16 / 14 / 12 / 10 |
| colour light | #2B2B2B · #636363 · #999999 |
| colour dark | #FFFFFF @ 80% / 64% / 40% |

## Statics & props

- `Title` — `level={1..5}`
- `Text` — `type="secondary|success|warning|danger"`, `strong`, `code`,
  `keyboard`, `mark`, `underline`, `delete`, `disabled`
- `Paragraph` — `ellipsis={{ rows }}`, `copyable`, `editable`
- `Link` — `href`, `target`

```jsx
const { Title, Text, Paragraph, Link } = window.Omada;
<Title level={3}>Devices</Title>
<Text type="secondary">12 offline</Text>
<Paragraph copyable>192.168.0.1</Paragraph>
```

## Do / Don't
- **Do** drive colour through `type` / token, not inline hex.
- **Don't** invent new heading sizes — reuse the 5-level scale.

## Figma
- `Text 文本` — node **565:49687** (font stack) + **2300:2655** (weight/size/usage matrix).
