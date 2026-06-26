# Progress — `Omada.Progress`

Thin wrapper over antd `Progress`. Matches the Figma "Progress 进度条" line + circle states.

**Figma:** Progress 进度条 node `43:34760` — line track 6px `#ECECEC` rail / brand-green fill / 100-radius caps with trailing `%` label or status glyph; circle 112px medium ring, 6px stroke, centred value or success/warning/error icon.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `tone` | `'normal' \| 'active' \| 'success' \| 'warning' \| 'error'` | `normal` | Convenience over antd `status`. `active` animates the stripe; `warning` paints the bar orange (antd has no warning status); `error` → antd `exception`. |
| `type` | `'line' \| 'circle' \| 'dashboard'` | `line` | |
| `percent` | `number` | `0` | |
| `size` | `number \| 'small' \| 'default'` | — | px for circle/dashboard; `small` for slim line. |
| `steps` | `number` | — | Segmented line. |

Plus all antd `Progress` props (`strokeColor`, `format`, `showInfo`, `status`, `strokeLinecap`…).

## Visuals

Colour is fully token-driven — `omada-theme.js → components.Progress` sets `defaultColor` (brand green), `remainingColor` (`#ECECEC` light / `#333` dark), `circleTextColor` and `lineBorderRadius: 100`. Semantic `success`/`exception` pull `colorSuccess`/`colorError`. The `warning` tone is the only one needing an explicit stroke (orange token), applied in the wrapper from `window.OMADA`.

## Do / Don't

- ✅ `<Progress tone="active" percent={80} />` for an in-flight upload.
- ✅ `<Progress type="circle" tone="success" percent={100} />` — antd renders the green check automatically.
- ❌ Don't hard-code `strokeColor` for the normal/success/error cases — let the tokens drive it.
