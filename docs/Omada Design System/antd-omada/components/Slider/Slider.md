# Slider — `Omada.Slider`

Thin wrapper over antd `Slider`. Matches the Figma "Slider 滑动输入条": a 3px `#ECECEC` rail, a brand-green active track, a 14px round handle with a green focus ring, and graduated `marks` rendered as quiet captions. Single value + `range`; horizontal + `vertical`.

A `unit` convenience appends a suffix to the tooltip value (e.g. `Mbps`, `%`, `dBm`).

**Figma:** Slider 滑动输入条 (node `3:17962`) — rail 3px `#ECECEC`, track `#00A870`, handle 14px, graduated segments ("有级分段") with value captions.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `unit` | `string` | — | Appends to the tooltip value via `tooltip.formatter`. |
| `range` | `boolean` | — | Two-handle range; value is `[a, b]`. |
| `marks` | `object` | — | `{ value: label }` — rendered as captions. |
| `step` | `number\|null` | — | `null` + `marks` = snap to marks only. |
| `vertical` | `boolean` | — | Wrap in a fixed-height container. |
| `tooltip` | `object` | — | Forwarded (merged after `unit`'s formatter). |
| …rest | — | — | All antd `Slider` props forwarded. |

## Theming
- Rail / track / handle / dot colours + sizes → `omada-theme.js` `components.Slider` (light + dark).
- 3px green focus ring + mark caption colours → `omada-overrides.css` `.ant-slider-handle:focus` / `.ant-slider-mark-text` (dark twins).

## Do / Don't
- ✅ Use `unit` instead of a custom `tooltip.formatter` for simple suffixes.
- ✅ Localize mark captions / unit labels via `window.t()` where they're words.
- ❌ Don't override the track colour inline — it's a token so dark mode follows.
