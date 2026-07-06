# ApprovalFlow

A request's life as a vertical timeline: **submitted → reviewing → approved / rejected**. Each stage carries an actor (who), a timestamp (when) and an optional note (why). The current stage pulses; completed stages get a tone rail (green done · red rejected · grey pending) joined by a connecting spine. An optional header shows the overall outcome pill. While the flow is still open and `pendingActions` is set, an **Approve / Reject** pair is shown to the reviewer — picking Reject opens an inline reason composer (a reason is required there), and both route through `onAction(decision, note)`.

Presentational: it renders whatever `stages` you pass — wire `onAction` to your own state machine.

**Figma:** derived from Steps 步骤条 vertical mode + Timeline 时间轴 dot/rail styling. Original request-review composite.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `stages` | `Stage[]` | `[]` | ordered timeline (see below) |
| `outcome` | `'pending' \| 'approved' \| 'rejected'` | `'pending'` | drives the header pill; gates `pendingActions` |
| `title` | `ReactNode` | — | header title |
| `meta` | `ReactNode` | — | header sub-line (id, amount, requester) |
| `showHeader` | `boolean` | `true` | hide for an embedded timeline |
| `pendingActions` | `boolean` | `false` | show Approve / Reject (only while `outcome === 'pending'`) |
| `onAction` | `(decision, note) => void` | — | `decision` is `'approve' \| 'reject'` |

**Stage** = `{ key, status, title, actor?, actorSrc?, actorColor?, role?, time?, note?, icon? }` where `status` is `'done' \| 'current' \| 'rejected' \| 'pending'`.

- Light + dark + i18n (en/zh) + RTL verified (spine + node mirror).
- Action buttons are ≥ 32 px; Reject requires a non-empty reason before it commits.
