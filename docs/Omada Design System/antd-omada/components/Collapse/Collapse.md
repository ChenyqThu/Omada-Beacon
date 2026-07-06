# Collapse — `Omada.Collapse`

Thin wrapper over antd `Collapse` in the Omada **card** style: each panel is a rounded card with a white header (`10px 16px`) and a grey-50 body (`16px 28px`), 8px radius, separated by a 12px gap. The expander is the OmadaIcon chevron (rotates on open), pinned to the **end** of the row. A `variant="ghost"` strips the cards for a hairline-rule list.

**Figma:** Collapse 折叠面版 (node `3:24623`) — 800px card, header border `#ECECEC`, radius 8, body bg `#F7F7F7`, title Manrope 500/14, green status text, up/down chevron at the right edge.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'card' \| 'ghost'` | `'card'` | `ghost` = no cards, bottom-rule rows. |
| `items` | `array` | — | antd v5+ data shape `{ key, label, children }`. |
| `accordion` | `boolean` | — | One panel open at a time. |
| `expandIcon` | `fn` | OmadaIcon chevron | Rotates with `isActive`. |
| `expandIconPosition` | `string` | `'end'` | Figma puts the arrow far-right. |
| …rest | — | — | All antd `Collapse` props forwarded. |

Use the **`.omada-collapse-status`** class on a trailing header span for the green right-edge status text.

## Theming
- Split header/body radius, gap, surfaces, ghost rules → `omada-overrides.css` `.omada-collapse` (+ `[data-omada-theme="dark"]` twins).
- Header/content padding + radius metrics → `omada-theme.js` `components.Collapse`.

## Do / Don't
- ✅ Put an `Icon name="info"` next to a header title and the status text on the right, like the Figma.
- ✅ Localize labels + body via `window.t()`.
- ❌ Don't pass `bordered`/`ghost` directly — the wrapper owns them via `variant`.
