# Theming — `Omada.Theming`

A **theming / token-architecture board** — the "how the skin is built" companion
to the ColorTokens palette board. ColorTokens shows the finished values; this
shows the **cascade** that produces them.

## What it shows

```
seed (colorPrimary)
   → map  (colorPrimaryHover / Active / Bg / Border / Text — DERIVED by antd)
      → component (Button · Switch · Checkbox · Tag that read those map tokens)
```

| Surface | Source |
|---|---|
| **Seed** | the single `colorPrimary` you set. |
| **Map (derived)** | `colorPrimaryHover / Active / Bg / Border / Text`, read **live** from `theme.useToken()` under the scoped provider — antd derives them from the seed. |
| **Component** | real Omada Button / Switch / Checkbox / Tag, recoloured purely by the seed change. |
| **Brand-hue swap** | preset seeds from the Omada accent ramp (green / blue / magenta / orange); clicking rebuilds a scoped `ConfigProvider`. |

## How the swap proves derivation

On swap the board clones the Omada base theme, sets `token.colorPrimary` to the
new hue, and **deletes** the explicit `colorPrimary{Hover,Active,Bg,Border,Text}`
overrides so antd's algorithm re-derives the whole map from the seed — exactly
as a production app that only sets the seed would. The map column and components
then read the freshly-derived tokens via `theme.useToken()`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `className` | `string` | — | Extra class on the root. |

## i18n

Sub-heads, descriptions, hue names and component labels are keyed under
`theme.*` via `window.t()`. The token names (`colorPrimaryHover`, …) are antd
identifiers shown literally.

## Theming

Columns, swatches, arrows and the hue buttons come from theme CSS vars in
`omada-overrides.css` (`.omada-theme*`) with `[data-omada-theme="dark"]` twins.
The only colours rendered are the seed presets and whatever antd derives.

## Rule

Build a color system from **one brand seed**: antd expands it into a 10-step
palette and the alias / map tokens. Override seeds and a few structural
component tokens — never hard-code a derived value.

**Figma:** the brand-ramp methodology is the Color frame
"基于品牌色延伸全套色系" (node `25331:84189`) — build a dark-to-light scale from
one brand seed. Here the derivation is antd's algorithm rather than the manual
opacity steps, but the principle (one seed → a full system) is identical.
