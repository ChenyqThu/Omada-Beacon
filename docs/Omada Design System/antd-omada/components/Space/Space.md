# Space — `window.Omada.Space`

Thin wrapper over antd `Space`, the inline layout primitive for consistent
gaps between sibling elements (button rows, tag rows, toolbars) without
per-element margins. Omada pins the named size presets to the 8-grid spacing
scale used across the Figma; numeric values still pass through unchanged.

## Size presets

| name | px |
|---|---|
| `small` | 8 |
| `middle` (default) | 16 |
| `large` | 24 |
| number | exact px |

## Forwarded antd props

`direction="horizontal|vertical"`, `align="start|center|end|baseline"`,
`wrap`, `split={<Divider type="vertical"/>}`. `Space.Compact` groups adjacent
controls (collapses inner radii into one seam) — use it for input + button
search bars and segmented control groups.

```jsx
<Space size="small">{buttons}</Space>
<Space split={<Divider type="vertical"/>} wrap>{links}</Space>
<Space.Compact><Select/><Input/><Button>Search</Button></Space.Compact>
```

## Do / Don't
- **Do** reach for `Space` instead of margins for any row/column of siblings.
- **Don't** nest deeply where CSS grid/flex `gap` on a parent is clearer.

## Figma
- Spacing scale is the shared 8-grid (`Empty-Space` page region, node group `13644:*`); no dedicated Space symbol — it is a layout utility.
