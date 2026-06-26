# notification — `Omada.useNotification()`

Thin wrapper over antd's **notification** API. Like message, the themed, locale-aware instance comes from `App.useApp()`, so this is a **hook**. Status helpers inject the matching OmadaIcon glyph + tone, default to **topRight** placement, and use the OmadaIcon close glyph. Notices carry a title (`message`) + `description`, and optionally a `btn` action node. Radius (8px) + padding from `omada-theme.js → components.Notification`.

**Figma:** Notification 通知提醒框 — node `29197:52977`.

```jsx
const notify = Omada.useNotification();
notify.success({ message: t('notif.adoptedTitle'), description: t('notif.adoptedBody') });
```

| Method | Glyph / tone |
|---|---|
| `success(opts)` | check-circle · green |
| `error(opts)` | ban · red |
| `info(opts)` | info · blue |
| `warning(opts)` | warning · orange |
| `open(opts)` / `notification` | raw App-context instance (use `.destroy(key)` to dismiss). |

`opts`: `{ message, description, btn, key, duration, placement, … }` — all antd notification args.

## message vs notification
- **message** — transient one-liner, auto-dismiss, no title. Confirmations ("Changes saved").
- **notification** — titled card with description and optional actions, top-right. Events the user may act on later (firmware available, device offline).

## Do / Don't
- ✅ Give actionable notices a `key` so the `btn` handlers can `notification.destroy(key)`.
- ❌ Don't use the static `antd.notification` — it renders outside the themed App context.
