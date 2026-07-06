# SpeedTest — `window.Omada.SpeedTest`

A **WAN speed-test result panel** with a run state machine: `idle → latency → down → up → done`. The active metric cell pulses while its value climbs live; completed runs append to a history sparkline (download solid / upload dashed, shared scale, inline SVG — no chart instance).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `target` | `{ latency, jitter, down, up }` | `{14, 3, 487, 312}` | Values the simulated run settles on. |
| `history` | `[{ down, up }]` | `[]` | Seed runs for the sparkline (last 14 shown). |
| `meta` | string | — | Caption (e.g. gateway · WAN port). |
| `onComplete` | `(result) => void` | — | Fires when a run finishes. |
| `className` | string | — | Forwarded. |

## Behaviour
- The built-in runner is a **presentational simulation** (rAF easing + slight wobble) — swap in real probe data upstream via `target`/`onComplete`.
- Latency counts *down* to its settled value; throughput climbs up.
- Digits stay LTR in RTL; sparkline colours come from CSS classes, not inline hex.

## Figma
SYMBOL `11837:40990` ("Frame 1739332406", the gateway Speed Test 模块 with up/down glyphs) plus the 链路测速 illustrations `26455:7365` (light) / `26455:9725` (dark). Metric anatomy follows Statistic / MetricCards; the sparkline follows the TrafficSparkline precedent.
