# RadiusProfileForm — `window.Omada.RadiusProfileForm`

A **RADIUS profile** settings cluster: profile name, authentication server + port (1812) + shared secret (password reveal), an accounting Switch expanding a server/port (1813) pair, and a **Test connection** action with idle → testing → reachable (`{ms} ms`) / no-response result pill.

Distinct from **FormPatterns** (Batch 16 — layout spec board): a purpose-built cluster with an async verify affordance.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `defaultName` / `defaultServer` / `defaultSecret` / `defaultAcctServer` | string | `''` | |
| `defaultPort` / `defaultAcctPort` | number | `1812` / `1813` | |
| `defaultAccounting` | boolean | `false` | Expands the accounting pair. |
| `onTest` | `({ server, port, secret }) => Promise<{ ok, ms? }>` | simulation | Default sim fails on empty server/secret or a server ending in `.0`. |

## Behaviour
- Editing server or secret resets the test result to idle.
- IP/port/secret fields render LTR mono in RTL.

## Figma
802.1X form FRAMEs `33185:46218` / `33185:46259` / `33185:46300` ("802.1X-开关类") show the in-product "RADIUS Profile" select-in-form usage this cluster feeds; field anatomy follows Form/Input tokens.
