# LoadingStates — `Omada.LoadingStates`

A **"how to show loading" pattern page** — *not* a new primitive. It ties the
three loading building blocks already in the library (**Spin · Skeleton ·
ChartEmpty**) into one decision board so a designer can pick the right one,
following the Figma `loading 加载` taxonomy.

## The four patterns

| Card | Figma | Use it when | Built from |
|---|---|---|---|
| **Inline / block** | 通用加载 | A section or block is fetching async data | `Spin` (icon · text · icon + text) |
| **Full page** | 全局加载 | The whole view is initializing | blocking `Spin` overlay + a top progress sweep |
| **Skeleton** | 骨架屏加载 | First load of structured content (cards, tables, lists) | `Skeleton` mirroring the final layout in grey |
| **Chart / blank** | 图表 / 空白 | A chart has no data, or the wait is sub-300ms | `ChartEmpty` keeps the frame; short waits stay blank |

Each card pairs a **"when to use"** caption with a **live specimen** built from
the real wrappers, so the guidance and the components can't drift apart. A
closing rule-of-thumb note summarises the decision.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `className` | `string` | — | Extra class on the root. |

Composition-only by design — it renders the other wrappers, it doesn't fork them.

## Theming & motion

All colour comes from theme CSS vars in `omada-overrides.css`
(`.omada-loadstate*`), each with a `[data-omada-theme="dark"]` twin. The only
bespoke motion is the indeterminate top-bar sweep, gated behind
`@media (prefers-reduced-motion: reduce)`. Spin / Skeleton / ChartEmpty carry
their own (already token-driven) styling.

## i18n

`ls.inline` / `ls.global` / `ls.skeleton` / `ls.chart` (tags) ·
`ls.inlineTitle` / `ls.globalTitle` / `ls.skeletonTitle` / `ls.chartTitle` ·
`ls.inlineWhen` / `ls.globalWhen` / `ls.skeletonWhen` / `ls.chartWhen` ·
reuses `loading.tip` / `loading.fetching` — all via `window.t()`.

**Figma:** `loading 加载` node `2942:88307` + `18920:27065` (page `43:34762`).
