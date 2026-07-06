# ColorPicker — `Omada.ColorPicker`

Thin wrapper over antd `ColorPicker` — used for LED / SSID-tag colours. Adds an Omada-curated `presets` swatch set read from `window.OMADA` (brand green · lime · blue · magenta · orange · red + neutrals) so picks stay on-palette, a 4px trigger radius, and the standard size set. Forwards `showText`, `allowClear`, `format`, `mode` (single/gradient), etc.

**Figma:** ColorPicker 颜色选择器 (node `3:20255`) — trigger swatch + popover with RGB/HSB inputs and preset swatches.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `presets` | `array` | Omada accent + neutral ramps | Read from `window.OMADA` tokens, not literals. |
| `showText` | `boolean` | — | Show the hex/format text beside the swatch. |
| `allowClear` | `boolean` | — | Clear to "no colour". |
| `format` | `hex\|rgb\|hsb` | — | — |
| `mode` | `['single','gradient']` | — | Enable gradient picking. |
| `size` | `small\|middle\|large` | `middle` | — |
| …rest | — | — | All antd `ColorPicker` props forwarded. |

`window.omadaColorPresets()` returns the preset array for reuse elsewhere.

## Theming
- Trigger radius → `omada-theme.js` `components.ColorPicker`; panel surfaces follow the dark algorithm automatically.
- Presets derive from the design tokens (`window.OMADA`) so the ramp tracks any token change.

## Do / Don't
- ✅ Keep the curated presets — they map to the accent ramp used across charts/tags.
- ✅ Localize the field label via `window.t()`.
- ❌ Don't hand-pass a free literal palette; extend `omadaColorPresets()` if a new on-brand swatch is needed.
