# Accessibility — `Omada.Accessibility`

An **accessibility spec board** — the live-specimen counterpart to the Motion
and ColorTokens boards. It renders the three accessibility floors from
`COMPONENT_SPEC §0` as things you can **tab through and inspect**, so the
guidance can never drift from the components.

## What it shows

| Surface | Source | Notes |
|---|---|---|
| **Focus states** | token `controlOutline` (`rgba(0,168,112,0.12)`, `0.22` in dark) | Real Omada Button / Input / checkbox / link — Tab into them and the **same** 3px green focus ring every wrapper ships appears. |
| **Hit targets** | token `controlHeight` `44 / 32 / 24` | Primary ≥ 44px, standard ≥ 32px, compact 24px — each drawn at its real height with a measured `min-height` overlay. |
| **Names, roles & states** | forwarded `aria-*` | Icon-only button (`aria-label`), required field (`aria-required`), Switch (`role="switch"` + `aria-checked`), polite live region (`aria-live`). Each is paired with a code tag naming the attribute. |

The Switch and live-region specimens are interactive so you can watch
`aria-checked` flip and the `role="status"` region announce.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `className` | `string` | — | Extra class on the root. |

No configuration by design — it is a specimen of the accessibility floor, not a
widget.

## Theming

Surfaces, target fills, code tags and the dim/measure overlays come from theme
CSS vars in `omada-overrides.css` (`.omada-a11y*`), each with a
`[data-omada-theme="dark"]` twin. The focus ring itself is the antd
`controlOutline` token — no brand hex in the JSX.

## i18n

`a11y.focus` / `focusDesc` · `a11y.hit` / `hitDesc` · `a11y.aria` / `ariaDesc` ·
`a11y.tabHint` · `a11y.primary` / `secondary` / `compact` · `a11y.iconBtn` /
`iconBtnNote` · `a11y.req` · `a11y.toggleName` · `a11y.live` / `liveMsg` ·
`a11y.note` — all via `window.t()`.

**Figma:** no dedicated accessibility frame exists in the source; the values are
the `COMPONENT_SPEC §0` floor (3px focus ring · ≥44 / ≥32px hit targets ·
forwarded `aria-*`), which live in `omada-theme.js → token`
(`controlOutline` / `controlHeight`).
