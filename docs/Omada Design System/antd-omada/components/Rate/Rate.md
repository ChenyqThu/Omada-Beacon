# Rate — `Omada.Rate`

Thin wrapper over antd `Rate`. Matches the Figma "Rate 评分".

**Figma:** Rate 评分 node `43:34765` — 5 stars, on-star `#FFCB00` (gold), off-star `#CCCCCC`; 32px star grid. Supports half-stars, read-only and disabled.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` / `defaultValue` | `number` | — | Controlled / uncontrolled. |
| `count` | `number` | `5` | Number of stars. |
| `allowHalf` | `boolean` | `false` | Half-star selection. |
| `disabled` | `boolean` | `false` | Read-only + dimmed. |
| `tips` | `string[]` | — | Per-star hover labels (alias of antd `tooltips`). |

Plus all antd `Rate` props (`character`, `allowClear`, `onChange`…).

## Visuals

Token-driven via `omada-theme.js → components.Rate`: `starColor: #FFCB00`, `starSize: 20`, `starBg` = `#CCCCCC` (light) / `#3A3A3A` (dark). No hard-coded hex in the wrapper.

## Do / Don't

- ✅ `<Rate tips={['Poor','Fair','Good','Great','Excellent']} />` for a quality rating.
- ✅ `disabled` for a read-only score display.
- ❌ Don't override `starColor` per-instance — it's an Omada token.
