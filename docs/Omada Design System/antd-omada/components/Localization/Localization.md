# Localization — `Omada.Localization`

An **i18n / localization board** — the internationalization counterpart to the
RTL demo and the Content board. It stress-tests the three things that break when
a UI meets a second language.

## What it shows

| Surface | How | Notes |
|---|---|---|
| **String expansion** | the same label in EN / 中文 / Deutsch, each chip sized to content | German runs ~35% longer, CJK shorter — proof you must never fix a control's width to its English label. |
| **Bidirectional & CJK** | one `label : value` row rendered LTR, then inside a `direction="rtl"` ConfigProvider | Icon side, alignment and padding mirror through antd — not bespoke CSS. |
| **Number / date / currency** | one instant + one number formatted per locale with `Intl.DateTimeFormat` / `Intl.NumberFormat` | ISO 8601 (numeric, 24h) · en-US (12h + AM/PM) · en-GB (EU order) · de-DE (`1.250,5`) · zh-CN (年月日). Computed **live**, so authoritative. |

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `className` | `string` | — | Extra class on the root. |

No configuration by design — it is a specimen of the localization rules.

## How the format table works

A single fixed UTC instant (`2025-03-12 12:22`) and number (`1,250.5`) are
passed through the platform `Intl` APIs with a per-row locale. The ISO row is
formatted by hand to the 8601 numeric / 24-hour pattern. Nothing is
transcribed — change the constants and every cell re-derives.

## i18n

Chrome (sub-heads, descriptions, column headers, the bidi label/value) is keyed
under `l10n.*` via `window.t()`. The expansion specimens are intentionally
multi-language regardless of the active language — comparing lengths is the
point. Locale tags (`en-US`, `zh-CN`, …) are literal identifiers.

## Theming

Expansion chips, the bidi panels and the format table come from theme CSS vars
in `omada-overrides.css` (`.omada-l10n*`) with `[data-omada-theme="dark"]`
twins. No brand hex in the JSX.

## Rule

Route product chrome through `window.t()`; let antd's `ConfigProvider locale`
own its built-ins (pickers, pagination, "No data"). Format dates and numbers
with `Intl`, not by hand, and size controls to content — never to one language.

**Figma:** the date-format rules are the Chart 国际化 note (`Axes`, page
`Chart`) — ISO 8601 numeric/24h, EU `DD/MM`, US 12h + AM/PM, CN `年月日`, pad
single digits. Original synthesis.
