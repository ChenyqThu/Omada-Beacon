# LicenseCard — `window.Omada.LicenseCard`

A **seat/term license tile**: edition name, activation-state pill, seat-usage meter, term dates with a days-left chip, masked license key (reveal + copy), and a state-appropriate CTA.

| State | Pill | CTA |
|---|---|---|
| `active` | quiet green | Manage (default button) |
| `expiring` (≤ 30 d) | warning + days-left chip | **Renew** (primary) |
| `expired` | red | **Renew** (primary danger) |
| `inactive` | neutral | **Activate** (primary) |

Distinct from **UsageMeter** (Batch 24 — a generic threshold meter): this is an entitlement tile where the meter is one row among term, key and CTA.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `license` | `{ name, edition, seatsUsed, seatsTotal, start, end, status?, key }` | — | `status` optional — otherwise derived from `end` (≤ 0 d expired · ≤ 30 d expiring · else active; no `end` = inactive). |
| `onRenew` / `onActivate` / `onManage` | `() => void` | — | CTA handlers. |
| `className` | string | — | Forwarded. |

## Behaviour
- Seat meter tints red at ≥ 90 % occupancy.
- Key masks all groups but the last (`••••-…-51B0`); reveal toggles, copy uses the clipboard API.
- Dates localise via `Intl`; key/dates stay LTR in RTL.

## Figma
License icon SYMBOL `36:30517` ("图标=License") and illustrations `26455:6228` (license) / `26455:5758` (change license) / `26455:5778` (change license failed) / `26455:6441` (empty, no license) — no card frame; tile anatomy follows Card tokens; pills follow Tag.
