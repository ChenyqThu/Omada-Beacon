# RateLimitProfile

Bandwidth-profile editor: a profile rail (Guest / Staff / IoT pills summarising ↓/↑ caps + SSID count) over an editor — download/upload caps (InputNumber, Mbps), an allow-burst switch expanding a burst-size field, and apply-to-SSID chips. One SSID belongs to one profile: clicking a chip owned elsewhere moves it to the active profile.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `profiles` | `{id, name, down, up, burst, burstMB, ssids}[]` | Guest/Staff/IoT demo set | `name` is an i18n key |
| `className` | `string` | — | merged onto the root |

## Behaviour

- Chip states: filled green = owned by active profile; outlined + owner tag = owned elsewhere (click moves, tooltip explains); dashed = unassigned.
- Burst size renders only while burst is on; editing any field live-updates the rail summary.

## Figma

No dedicated frame — the pill rail follows NetworkSelector metrics, chips follow Tag (radius 4). Distinct from UsageMeter (displays consumption; this edits caps) and AlarmRules (thresholds → alerts).
