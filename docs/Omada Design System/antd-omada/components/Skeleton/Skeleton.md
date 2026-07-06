# Skeleton — `Omada.Skeleton`

Thin wrapper over antd `Skeleton`. Matches the Figma "loading 加载" skeleton
rows — grey `#ECECEC` blocks at 2–3px radius with the paragraph's last row
shorter — and ships with `active` on so the shimmer reads immediately. The
shimmer wash comes from `Skeleton.gradientFromColor / gradientToColor` (a dark
wash in light mode, a light wash in dark mode), so it never hard-codes a
brand value.

Split out of the old combined **Loading** section (Batch 11).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `active` | `boolean` | `true` | Shimmer animation. Forwarded. |
| `avatar` | `boolean \| object` | — | Leading avatar placeholder. |
| `title` | `boolean \| object` | — | Title bar. |
| `paragraph` | `boolean \| { rows, width }` | — | Body rows; last row auto-shortens. |
| `loading` | `boolean` | — | When `false`, renders `children` instead. |
| `round` | `boolean` | — | Rounds row ends. |

### Statics (re-exported)

`Skeleton.Button` · `Skeleton.Avatar` · `Skeleton.Input` · `Skeleton.Image` ·
`Skeleton.Node` — compose richer loading shells. Each takes `active`, `size`,
`shape`. `Skeleton.Node` accepts children (e.g. a placeholder glyph).

**Tokens:** `Skeleton.blockRadius / titleHeight / paragraphLiHeight` plus the
per-mode `gradientFromColor / gradientToColor` in `omada-theme.js`. No brand
hex in the JSX.

**Figma:** loading 加载 node `3:26828` (page `43:34762`) — skeleton row stack
(static `#ECECEC` + the `#ECECEC → #F7F7F7` shimmer variant).
