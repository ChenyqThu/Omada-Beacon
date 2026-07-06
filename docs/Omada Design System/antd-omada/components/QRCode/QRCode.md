# QRCode — `Omada.QRCode`

Scannable code for add-device, controller pairing and 2FA. antd `<QRCode>` draws on canvas and its colours are **not** theme tokens, so the wrapper reads the Omada brand green + surface off the active theme and passes them in.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `brand` | `boolean` | `true` | Tints modules Omada green; `false` → neutral ink for print. |
| `value` | `string` | — | Encoded payload. |
| `status` | `'active' \| 'expired' \| 'loading' \| 'scanned'` | `'active'` | antd supplies the localized status text via `locale`. |
| `icon` / `iconSize` | `string` / `number` | — | Centre logo. |
| `onRefresh` | `() => void` | — | Fires from the expired overlay. |
| `color` / `bgColor` | `string` | themed | Explicit overrides win. |

`errorLevel` defaults to `M`. **i18n:** captions via `window.t()` (`qr.*`); antd owns the in-canvas status label. **Figma:** pairing / add-device QR pattern.
