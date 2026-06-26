# Grid — `window.Omada.Row` / `window.Omada.Col`

Thin wrappers over antd's 24-column `Row`/`Col` grid — the responsive
skeleton behind the Omada dashboard, settings and device pages. Purely
structural (no colour), so it renders identically in light + dark.

## Omada opinion
`Row` defaults `gutter={[16, 16]}` (horizontal + vertical, on the 8-grid).
Override with any antd gutter (number, `[h, v]`, or responsive object).

## Forwarded antd props
- **Row** — `gutter`, `justify` (`start|center|end|space-between|space-around`), `align` (`top|middle|bottom`), `wrap`
- **Col** — `span` (1–24), `offset`, `push`, `pull`, `order`, `flex`, and responsive `xs`/`sm`/`md`/`lg`/`xl`/`xxl`
- `window.Omada.Grid` re-exports antd `Grid` for `Grid.useBreakpoint()`.

```jsx
const { Row, Col } = window.Omada;
<Row>
  <Col xs={24} sm={12} md={8} lg={6}>…</Col>
  …
</Row>
```

## Do / Don't
- **Do** lay KPI tiles and form columns on the 24-grid with responsive spans.
- **Don't** use Grid for tiny inline gaps — that's `Space`.

## Figma
- `Layout 布局` page — node **3:64434** (dashboard / settings / device / add-edit grids).
