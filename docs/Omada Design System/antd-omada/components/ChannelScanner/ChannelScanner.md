# ChannelScanner — `window.Omada.ChannelScanner`

An **RF environment scan**: 2.4 / 5 GHz Segmented over per-channel **utilization bars** (deterministic seeded values — 2.4 GHz crowded around 1/6/11, 5 GHz lighter with quieter DFS range). The **recommended** channel (lowest utilization) is brand-green with a star flag; the radio's **current** channel is outlined. Tooltip: channel · utilization % · APs heard. **Rescan** regenerates the seed behind a brief shimmer; bars ease to new heights.

Distinct from **BarChart** (Batch 6 — ECharts wrapper): a purpose-built spectrum strip with a built-in recommendation rule, no chart engine.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `defaultBand` | `'2.4' \| '5'` | `'2.4'` | |
| `currentChannels` | `{ '2.4': n, '5': n }` | `{ '2.4': 6, '5': 44 }` | Per-band current channel. |
| `onScan` | `() => void` | — | After a rescan lands. |

## Behaviour
- Channels: 2.4 GHz → 1–13; 5 GHz → 36–165 (17 common channels).
- Channel order stays LTR in RTL; footer legend localizes recommended/current.

## Figma
Icon SYMBOL `25947:10047` ("channel utilization") — no full frame; bars follow TrafficSparkline/UsageMeter metrics.
