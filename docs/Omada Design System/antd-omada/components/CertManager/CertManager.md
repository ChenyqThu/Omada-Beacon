# CertManager — `window.Omada.CertManager`

A **controller certificate inventory**: rows show name + CN, issuer, a type chip (server / CA / client), SHA-256 fingerprint with copy, and a derived expiry status chip — **valid** (> 30 d), **expires in {d} d** (≤ 30 d, warning) or **expired** (error). Expiring/expired rows get a per-row **Renew** (spinner → +1 year); the header **Upload** stubs an import that prepends a fresh row tagged "Imported just now".

Distinct from **LicenseCard** (Batch 26 — one entitlement with seats): a multi-row PKI inventory keyed on expiry windows.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `defaultCerts` | `[{ id, name, cn, issuer, type, expires, fp }]` | `[]` | `expires` ISO date; `type ∈ server · ca · client`. |
| `onRenew` | `(id) => void` | — | After the renew stub completes. |
| `onUpload` | `() => void` | — | After the upload stub completes. |

## Behaviour
- Status derives from the end date at render time (same rule family as LicenseCard).
- Expiry dates localize via the active locale; fingerprints render LTR mono in RTL.

## Figma
Icon SYMBOLs `25947:12688` ("certificate-authority") and `25947:10070` ("证书") — no full frame; rows follow Table/Tag tokens.
