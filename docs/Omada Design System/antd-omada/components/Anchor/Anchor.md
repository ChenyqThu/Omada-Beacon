# Anchor — `Omada.Anchor`

In-page section navigation with scroll-spy. Thin wrapper over antd `<Anchor>`; the active marker colour comes from the `colorPrimary` token, the rail + active weight from `omada-overrides.css` (with a dark twin).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `{ key, href, title }[]` | — | antd 6 preferred API. Forwarded as-is. |
| `getContainer` | `() => HTMLElement` | `window` | Scope scroll-spy to a panel. |
| `targetOffset` | `number` | — | Offset from top when jumping. |
| `affix` | `boolean` | `true` | Set `false` inside a scoped panel. |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | Forwarded. |

All antd `Anchor` props forwarded; `Anchor.Link` re-exported for the children API.

**i18n:** section titles via `window.t()` (e.g. `anchor.overview`). **Figma:** nav pattern from `/Layout` (node `3:64434`).
