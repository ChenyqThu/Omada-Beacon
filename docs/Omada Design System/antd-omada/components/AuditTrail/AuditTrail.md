# AuditTrail — `window.Omada.AuditTrail`

A **day-grouped security audit log** — who did what, from where, and whether it worked. Each row reads time · actor · action (+ target chip) with an IP chip and a **result pill** (success / failed / denied). Days group under "Today / Yesterday / date" headers with counts; failed and denied rows carry a tinted accent.

Distinct from **ActivityLog** (Batch 21) — that is a *live event feed* (relative times, streaming order). The AuditTrail is the reviewable security record: calendar-grouped, absolute mono timestamps, actor + source IP + outcome on every row.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `entries` | `Entry[]` | `[]` | Sorted internally, newest first. |
| `filter` | `'all' \| 'success' \| 'failed' \| 'denied'` | `'all'` | Narrow by result — wire to a Segmented. |
| `className` | string | — | — |

### Entry

```js
{ id, ts,            // epoch ms
  actor,             // user name → initial avatar
  action,            // localized verb phrase (pass through window.t yourself)
  target?,           // object acted on → mono code chip
  ip?,               // source IP → mono chip (stays LTR in RTL)
  via?,              // channel — Web / Cloud / API
  result }           // 'success' | 'failed' | 'denied'
```

## Behaviour
- Day labels localise via `Intl` (`zh-CN` in Chinese); "Today" / "Yesterday" via i18n keys.
- Result tones: success → brand green, failed → error red, denied → warning orange; failed/denied rows get a faint row wash.
- Empty (or fully filtered-out) state shows a quiet shield note.

## Notes
- Timestamps and IPs are forced LTR inside RTL layouts; all chrome strings translate.
- Dark twins for every surface, chip and wash.

## Figma
No dedicated node — row anatomy follows the Table / ActivityLog language; result pills use the semantic tones.
