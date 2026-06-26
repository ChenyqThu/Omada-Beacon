# Density — `Omada.Density`

A **density / compact-mode board**. It shows that a single `ConfigProvider`
re-scales a whole subtree **two independent ways**, with no per-component edits:

| Knob | antd input | Effect |
|---|---|---|
| **Component size** | `componentSize="small \| middle \| large"` | Control **height** — `controlHeightSM / … / LG` = `24 · 32 · 40` |
| **Compact** | `theme.algorithm = [..., compactAlgorithm]` | Tightens **padding** and the row / item rhythm (table cells, form gaps, list rows) |

The two live controls (a Radio segmented for size, a Switch for compact) rebuild
the scoped theme on the fly. The rebuild re-uses `getOmadaTheme(mode)` and only
**appends** `compactAlgorithm` to whatever algorithm list the mode already needs
(`darkAlgorithm` in dark) — so the Omada tokens and dark mode are always
preserved.

A representative specimen set — Button · Input · Select · Radio · Tag · a small
Table — lives inside the scoped provider so you can read the effect across the
library at once.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `className` | `string` | — | Extra class on the root. |

## Theming

The control bar, stage and note use theme CSS vars in `omada-overrides.css`
(`.omada-density*`) with `[data-omada-theme="dark"]` twins. The specimen
components are themed entirely by the scoped `ConfigProvider` — the board adds no
component colour of its own.

## When to use which

Default everywhere by default. **Small / compact** suits data-dense admin tables
and side panels; **Large** suits touch or marketing surfaces. Never mix sizes
within one toolbar.

## i18n

`density.size` · `density.compact` · `density.small` / `middle` / `large` ·
`density.desc` · `density.note` — plus the reused `device.*` / `field.*` /
`table.col.*` / `status.*` content keys — all via `window.t()`.

**Figma:** no dedicated density frame; this is the antd `ConfigProvider`
`componentSize` + `theme.compactAlgorithm` story, themed with the Omada
`controlHeight` scale in `omada-theme.js`.
