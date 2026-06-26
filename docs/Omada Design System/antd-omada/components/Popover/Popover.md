# Popover — `Omada.Popover`

Thin wrapper over **antd `Popover`** — the rich, **light-surface** bubble with title + content + optional actions (distinct from Tooltip's dark spotlight). Defaults: 8px radius (`token`), Omada shadow, arrow shown. The `icon` prop composes a leading `OmadaIcon` next to the title for the confirm-style bubble.

**Figma:** Popover 气泡卡片 — node `3:25129` (confirm bubble: warning icon, title 16/500, body 14, Yes/No footer).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `icon` | `string` | — | `OmadaIcon` name shown before the title. |
| `iconTone` | `string` | green | CSS colour for the leading icon. |
| `title` | `node` | — | Bubble heading. |
| `content` | `node` | — | Body — may contain buttons, `Descriptions`, etc. |
| *(all antd Popover props)* | | | `trigger`, `open`, `onOpenChange`, `placement`, … forwarded. |

## Do / Don't
- ✅ Confirm: `<Popover icon="warning" iconTone="…orange" title={t('pop.rebootTitle')} content={<ConfirmBody/>} trigger="click">`
- ✅ Rich: embed `Omada.Descriptions` in `content` for a device-info bubble.
- ❌ Don't use Popover for a one-line hint — that's `Omada.Tooltip`.
