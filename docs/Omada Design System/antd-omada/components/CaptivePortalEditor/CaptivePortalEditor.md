# CaptivePortalEditor

Splash/login page builder for hotspot captive portals. Control column (welcome title + message inputs, auth-method radio `none | password | voucher`, four curated accent swatches from the OMADA ramp, show-logo + require-terms switches) drives a live miniature phone-frame preview: logo placeholder, welcome copy, guest auth control, terms row and an accent-tinted Connect button.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `defaultAuth` | `'none'\|'password'\|'voucher'` | `'voucher'` | initial auth method |
| `className` | `string` | — | merged onto the root |

## Behaviour

- Title/message state starts `null` → renders the localized default until the user types (so switching language updates untouched copy).
- Accent swatches read from `window.OMADA` (green/blue/orange/magenta) and swap to their dark-ramp variants when `mode === 'dark'`.
- The phone preview is presentational — its controls are mock elements, not focusable inputs.

## Figma

SYMBOL `25947:12260` ("Property 1=portal") — no full portal-builder frame in the file; phone metrics follow the TwoFactorSetup card scale. Distinct from VoucherPrinter (prints codes; this designs the page guests see).
