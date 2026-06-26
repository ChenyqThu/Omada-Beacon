# Spacing — `Omada.Spacing`

A **spacing / layout-token board** — the measured-specimen counterpart to the
Elevation board. Elevation owns radius + shadow; this owns the **8-grid spacing
system**.

## What it shows

| Surface | Source | Notes |
|---|---|---|
| **Base unit** | `8px` (+ `4` half-step) | The rule stated plainly: every gap, inset and offset is a multiple of 8, with 4 as the only half-step. |
| **Spacing scale** | `4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48` | Each value drawn as a bar whose **width is the real value**, so the steps are visually measured, with an `8 × N` multiple tag. |
| **Gaps** | flex `gap` | Three sibling rows at `8 / 16 / 24px` so you can see the distance the grid produces. |
| **Insets** | component padding tokens | Table-cell `12` · Card `20` · Modal `24`, each a measured inset frame tied to where it's used. |

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `className` | `string` | — | Extra class on the root. |

No configuration by design — it is a specimen of the spacing scale.

## Theming

Bars, tracks, gap chips and inset frames come from theme CSS vars in
`omada-overrides.css` (`.omada-spacing*`) with `[data-omada-theme="dark"]`
twins. No brand hex in the JSX.

## Rule

Spacing **tokens, not magic numbers**. When a value isn't on the scale, round to
the nearest step rather than inventing a new one.

## i18n

`spacing.base` / `baseDesc` · `spacing.scale` · `spacing.gaps` / `gapsDesc` ·
`spacing.insets` / `insetsDesc` · `spacing.cell` / `card` / `modal` ·
`spacing.note` — all via `window.t()`.

**Figma:** no dedicated spacing frame; the 8-grid is the design-system spacing
rule (root README / `colors_and_type.css`) and the component padding tokens in
`omada-theme.js` (`Table.cellPaddingInline 14` · `Card.bodyPadding 20` ·
`Modal.paddingMD 24`).
