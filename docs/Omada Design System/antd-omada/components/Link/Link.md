# Link — `Omada.Link`

`Typography.Link` promoted to its own component. Brand-green text link (green
at rest → darker green on hover, matching the Breadcrumb link tokens), with the
three affordances a product UI reaches for repeatedly.

> Note: `Omada.Typography.Link` (the raw antd static) is still re-exported by
> the Typography wrapper. `Omada.Link` is this richer convenience version.

## Convenience props

| Prop | Type | Notes |
|---|---|---|
| `icon` | `string \| ReactNode` | Leading glyph. A string resolves through `OmadaIcon`. |
| `external` | `boolean` | Sets `target="_blank"` + `rel="noopener noreferrer"` and appends the trailing `external-link` glyph. |
| `size` | `'sm' \| 'default' \| 'lg'` | 12 / 14 / 16px, on the Manrope type scale. |

Forwards every antd `Typography.Link` prop: `href`, `target`, `rel`, `onClick`,
`disabled`, `strong`, `italic`, `underline`, `type` (`secondary` / `success` /
`warning` / `danger`), `copyable`, `ellipsis`.

**Styling:** the `omada-link` class (+ `omada-link-label` / `omada-link-ext`)
in `omada-overrides.css` aligns the glyph, sets the green rest/hover colour and
a dark twin. No brand hex in the JSX. Hit target stays inline with surrounding
text; standalone links get the full focus ring from antd.

**i18n:** label text via `window.t()`. **Figma:** Text 文本 node `565:49687`
(family + usage; link = brand-green text).
