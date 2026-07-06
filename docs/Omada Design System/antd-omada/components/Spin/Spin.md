# Spin — `Omada.Spin`

Thin wrapper over antd `Spin`. Supplies the bespoke Omada indicator — the
`refresh` glyph spun by the shared `.omada-spin` keyframe, recoloured to
`colorPrimary` — so the busy state reads as one family with the Steps loading
node. Adds the `omada-spin-wrap` class so the overrides layer colours the dot
and the green tip.

Split out of the old combined **Loading** section so Spin and Skeleton each
document independently (Batch 11).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `size` | `'small' \| 'default' \| 'large'` | `'default'` | Maps the indicator to the 16 / 24 / 36 dot tokens. |
| `spinning` | `boolean` | `true` | Forwarded. Wrap children to render a blocking overlay. |
| `tip` | `ReactNode` | — | Green caption under the indicator (use `window.t('loading.tip')`). |
| `percent` | `number \| 'auto'` | — | antd 6 determinate ring / auto-indeterminate. |
| `delay` | `number` | — | Forwarded — skips the spinner for fast responses. |
| `fullscreen` | `boolean` | `false` | Forwarded full-page scrim. |
| `indicator` | `ReactNode` | Omada glyph | Override the bespoke indicator if needed. |

All other antd `Spin` props (`wrapperClassName`, `children`, …) forwarded.

**Tokens:** `Spin.dotSize / dotSizeSM / dotSizeLG` in `omada-theme.js`; colour
via `.omada-spin-indicator` / `.ant-spin-text` (+ dark twins) in
`omada-overrides.css`. No brand hex in the JSX.

**i18n:** tip / fetching strings via `window.t()` (`loading.tip`,
`loading.fetching`). **Figma:** loading 加载 node `3:26828` (page `43:34762`).
