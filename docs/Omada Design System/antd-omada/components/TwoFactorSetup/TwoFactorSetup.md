# TwoFactorSetup — `window.Omada.TwoFactorSetup`

A **three-step two-factor enrolment card**: scan QR (antd `QRCode`, otpauth URI, copyable manual secret) → enter a **6-digit segmented code** (auto-advance, backspace walks left, full-code paste, shake-on-reject) → save **recovery codes** (copy-all + client-side `.txt` download) → success state.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `account` | string | `admin@hq-campus` | Shown in the card + encoded in the otpauth URI. |
| `secret` | string | demo base32 | Manual-entry key, grouped in 4s. |
| `issuer` | string | `Omada` | otpauth issuer. |
| `recoveryCodes` | string[] | 8 demo codes | One-time codes sheet. |
| `onVerify` | `(code) => bool` | rejects `000000` | Return `false` to show the error path. |
| `onDone` | `() => void` | — | Fires from the success state (demo resets to step 1). |
| `className` | string | — | Forwarded. |

## Behaviour
- QR colour follows the theme mode (token fg on transparent) — no white slab in dark.
- Code boxes and the secret stay LTR/mono in RTL; `autocomplete="one-time-code"` on each box.
- Try `000000` to see the reject/shake path.

## Figma
2FA illustration SYMBOLs `26455:6150` ("需要认证2FA") / `26455:6169` ("关闭2FA"), dark twin `26455:9651` — no setup-flow frame; step anatomy follows Steps; inputs follow Input tokens.
