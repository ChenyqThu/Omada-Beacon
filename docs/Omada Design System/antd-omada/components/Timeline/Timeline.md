# Timeline — `Omada.Timeline`

Vertical activity / event feed (adoption → provisioning → online, firmware, audit log). antd `<Timeline>` draws the rail + dots; the wrapper adds a per-item `tone` convenience and optional OmadaIcon dots.

| Item prop | Type | Notes |
|---|---|---|
| `tone` | `'success' \| 'processing' \| 'info' \| 'warning' \| 'error' \| 'muted'` | Maps to the antd semantic dot `color`; `processing` adds a CSS pulse. |
| `iconName` | `string` | OmadaIcon dot (size 15). |
| `children` | `node` | Row content. |
| `color` / `dot` | — | Explicit overrides win over `tone` / `iconName`. |

Wrapper props: `items` (mapped) or children; `mode`, `pending`, `reverse` forwarded. Dot colours come from tokens; pulse + rail tint live in `omada-overrides.css` (dark twin). **i18n:** entries via `window.t()` (`tl.*`). **Figma:** audit-log / event-feed pattern (`icon/sidebar/audit log` `5547:54059`).
