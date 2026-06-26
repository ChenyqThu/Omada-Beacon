# Calendar — `Omada.Calendar`

Thin wrapper over antd `Calendar` (fullscreen month grid). Matches the Figma "Calendar 日历".

**Figma:** Calendar 日历 node `43:34747` — collapsed 1px cell borders, right-aligned date number, selected/today cell = inset `0 3px 0 0 #00A870` accent + `rgba(0,168,112,0.1)` wash with green date number; per-day event rows tinted success (green) / warning (orange) / error (red).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `events` | `{ [YYYY-MM-DD]: { tone, text }[] }` | — | Per-day event rows. `tone` ∈ `success` / `warning` / `error`. |
| `cellRender` | `(date, info) => node` | — | Override the default event renderer entirely. |
| `fullscreen` | `boolean` | `true` | antd full month vs. mini card. |
| `value` / `onSelect` / `onPanelChange` | — | — | Standard antd controlled props. |

Plus all antd `Calendar` props.

## Visuals

- Selected/today accent bar + `rgba(0,168,112,0.1)` wash, collapsed grid borders, and event-row layout live in `omada-overrides.css` (`.omada-calendar`, + `[data-omada-theme="dark"]` twin) — antd tokens can't express the 3px inset accent.
- Event-row colours read from CSS vars `--om-cal-success/warning/error`, themed per mode.
- `itemActiveBg`, `fullBg`, `fullPanelBg`, `colorPrimary` come from `omada-theme.js → components.Calendar`.
- Month names, weekday headers and **week start** follow `ConfigProvider locale` (zhCN / enUS) — never hand-translated.

## Do / Don't

- ✅ Pass `events` keyed by ISO date for maintenance / firmware / outage markers.
- ✅ Let the header (year/month selects + Month/Year switch) stay antd default — it's themed.
- ❌ Don't translate month/weekday names yourself — that's antd's `locale`.
