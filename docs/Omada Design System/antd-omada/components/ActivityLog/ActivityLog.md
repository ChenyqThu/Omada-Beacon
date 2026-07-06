# ActivityLog — `window.Omada.ActivityLog`

An activity / audit-log **feed**: a reverse-chronological stream of events
grouped by day (Today / Yesterday / date), each row a leading tone icon disc + a
sentence (actor · action · target chip) + a relative timestamp, with a
**load-more** footer that reveals the next page and reports how many remain.

Derived from Figma **Change Log 更新日志** node `25331:73512` (green header,
rounded row cards, numbered disc, "Updated By" actor). Original feed redraw — the
denser audit-stream variant of `Timeline`.

## Props

| Prop | Type | Notes |
|---|---|---|
| `items` | `[{ key, icon, tone, actor, action, target?, time, meta? }]` | `time` is a `Date` or epoch ms; sorted newest-first internally |
| `pageSize` | number | Initial visible count; "Load more" appends one more page (default 6) |

Item fields: `icon` is an `OmadaIcon` name; `tone` ∈ `brand · blue · orange ·
red · neutral` colours the disc; `target` renders as an inline chip; `meta` is a
secondary caption line.

## Behaviour

- Items are sorted newest-first and bucketed into day groups; headers read
  **Today** / **Yesterday** (localized) or a locale-formatted date.
- Client-side paging only — there is no data transport. "Load more" reveals the
  next `pageSize` and shows the remaining count; the footer hides at the end.
- Timestamps are relative (`just now` / `12m` / `14:02`) and respect the active
  language.
- RTL-safe: the connector rail and the timestamp side mirror.

## Tokens / CSS

Disc tones, the connecting rail, group headers, the target chip and the load-more
button live in `omada-overrides.css` under `.omada-alog*` with a
`[data-omada-theme="dark"]` twin. Tone discs use the Omada accent ramp / semantic
colours; no hard-coded brand hex in the JSX.
