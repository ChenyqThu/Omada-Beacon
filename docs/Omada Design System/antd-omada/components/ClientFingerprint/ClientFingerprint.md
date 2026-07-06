# ClientFingerprint — `window.Omada.ClientFingerprint`

A **device-identity card**: what the controller believes a client is and how sure it is. Detected OS / vendor / category, the fingerprinting method, a confidence meter (high ≥ 80 · medium ≥ 50 · low), and a category **override** Select with one-click reset to auto.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `client` | `{ name, mac, os, vendor, category, confidence, method }` | — | `method: 'dhcp' \| 'ua' \| 'mdns'`. |
| `override` | category key \| `null` | `null` | Controlled manual category; card shows a "Manually set" flag. |
| `onOverride` | `(key \| null) => void` | — | `null` = reset to auto. |
| `className` | string | — | Forwarded. |

Category keys: `laptop · phone · camera · printer · iot · unknown` (each maps to an OmadaIcon glyph).

## Behaviour
- Confidence tones: high = brand green, medium = orange, low = red — meter, %, and level label all follow.
- The identity tile tints with the confidence level; MAC stays LTR/mono in RTL.
- Distinct from **Descriptions** — this is an identity surface with a trust meter + correction affordance.

## Figma
Device-identity SYMBOL set `/icon/components/Property1*` (e.g. `25947:14123` "Property 1=iphone"; android/macbook/pad/imac/tv/scanner/other siblings) — no full identity-card frame; card anatomy follows Card / Descriptions tokens.
