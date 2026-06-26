# NotificationMatrix

The notification-preferences grid: events down the rows, delivery channels across the columns, a `Switch` in every cell. Each **column header** is a bulk toggle (turn a whole channel on/off) that reflects all-on / some-on / all-off; each **row** shows the event name + a one-line description. Cells that don't apply (a channel that can't carry an event) can be **locked** — they render a muted dash instead of a switch and are skipped by the bulk toggles and the count.

Fully controlled: `value` is a flat map keyed `"<eventKey>:<channelKey>"` (build keys with `OmadaNotificationMatrix.key(ek, ck)`), and `onChange` returns the next map. A "{n} of {total} on" footer keeps overall state legible.

**Figma:** derived from Switch 开关 + the Table 表格 header/row grid + Form 表单 settings rows. Original preferences-matrix composite.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `events` | `{ key, label, desc? }[]` | `[]` | matrix rows |
| `channels` | `{ key, label, icon? }[]` | `[]` | matrix columns |
| `value` | `Record<string, boolean>` | `{}` | flat `"event:channel"` map |
| `locked` | `Record<string, true>` | `{}` | cells rendered as N/A dashes |
| `onChange` | `(nextValue) => void` | — | fires on any cell / column toggle |
| `rowHeader` | `string` | `t('nm.event')` | top-left corner label |
| `showSummary` | `boolean` | `true` | the "{n} of {total} on" footer |

- Light + dark + i18n (en/zh) + RTL verified (grid + column-state pip mirror).
- Each `Switch` carries an `aria-label` of "event · channel"; column headers are focusable bulk toggles.
