# AlarmRules — `window.Omada.AlarmRules`

A **threshold-rule builder**. Each row reads as a sentence: *[enabled] When [metric] is [above|below] [value unit] for [n min] → [severity]*. Controlled via `rules` + `onChange`.

Distinct from **FilterBuilder** (Batch 19 — query rows that filter a table): these rows *define alerting thresholds* with severity and a sustain window, and each row can be disabled without deleting it.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `rules` | `[{ id, enabled, metric, op, value, sustain, severity }]` | `[]` | `metric: cpu \| mem \| clients \| traffic \| loss` · `op: 'gt' \| 'lt'` · `severity: critical \| warning \| info`. |
| `onChange` | `(nextRules) => void` | — | Fires on every edit / add / remove / toggle. |
| `className` | string | — | Forwarded. |

## Behaviour
- The value **unit follows the metric** (% · Mbps · clients) and the InputNumber clamps to the metric's max.
- Severity Select shows a coloured dot (critical red · warning orange · info blue).
- Disabled rows fade but keep their configuration; empty list shows a dashed empty state.

## Figma
Alarm icon SYMBOLs `25947:13658` ("icon/网络告警") / `25947:13665` ("icon/监控告警") — no rule-builder frame exists in the file; row anatomy follows the FilterBuilder precedent; pills follow Tag tokens.
