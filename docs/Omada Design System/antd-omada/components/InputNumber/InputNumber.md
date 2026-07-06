# InputNumber — `Omada.InputNumber`

Thin wrapper over **antd `InputNumber`**. Covers the five Figma variants with plain antd props plus two conveniences. Radius (4px) and 32 height come from `omada-theme.js → components.InputNumber`.

**Figma:** InputNumber 数字输入框 — node `3:16328` (basic / unit-after / unit-before / fixed-label / range-limited; dark twin `3:16498`).

| Prop | Type | Maps to | Notes |
|---|---|---|---|
| `unit` | `node` | `addonAfter` | Trailing unit — "Mbps", "min". |
| `unitBefore` | `node` | `addonBefore` | Leading unit — "MTU", "$". |
| `min` / `max` | `number` | — | Range-limited variant; clamps on blur. |
| `prefix` | `node` | — | Fixed inline label. |
| `formatter` / `parser` | `fn` | — | Thousands separators etc. |
| `controls` | `boolean` | — | Set `false` to hide the stepper. |
| *(all antd InputNumber props)* | | | `step`, `precision`, `onChange`, … forwarded. |

## Do / Don't
- ✅ Use `unit` / `unitBefore` for the formatted variants instead of hand-building an addon group.
- ✅ Localise the unit string via `t('units.mbps')` so it follows the active language.
- ❌ Don't use a plain `Input` with `type="number"` — InputNumber gives clamping, stepper and parsing.
