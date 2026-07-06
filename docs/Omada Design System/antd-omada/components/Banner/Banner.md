# Banner

Full-width system / announcement bar — the non-modal "everyone needs to know this" strip above page content (maintenance windows, firmware availability, trial countdowns, region incidents). Tones map to the semantic ramp: `info · success · warning · critical · brand`. Dismissal is **persistent**: closing writes `omada.banner.<id>` to localStorage and the banner stays hidden on reload.

**Figma:** derived from Alert 警告提示 banner mode (`2942:91347` / `3:25828`) — same tone discs stretched to a page-width bar. Original.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `id` | `string` | — | required for persistence |
| `tone` | `'info'\|'success'\|'warning'\|'critical'\|'brand'` | `'info'` | colour + default icon |
| `icon` | icon name | tone default | override leading glyph |
| `message` | node | — | body (or `children`) |
| `action` | `{ label, icon?, onClick }` | — | inline action link |
| `closable` | `bool` | `true` | show the × |
| `persist` | `bool` | `true` | remember dismissal in localStorage |
| `banner` | `bool` | `false` | full-bleed (no side radius) |
| `onClose` | `(id) => void` | — | fired on dismiss |

**Statics:** `Banner.Stack({ items })` renders an array (skips dismissed); `Banner.reset(ids)` clears flags; `Banner.isDismissed(id)`.

- Light + dark + i18n (en/zh) + RTL verified. Bar is `role="status"`.
