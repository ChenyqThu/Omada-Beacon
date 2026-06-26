# PortPanel — `window.Omada.PortPanel`

A **switch port-grid visualization** — the faceplate view. RJ45 ports lay out in real switch order (odd row on top, even row below, numbered in column pairs), SFP / uplink cages group at the end, and every tile carries a **status tone**: up (brand green), down (hollow), disabled (dimmed), error (red), plus a PoE dot and an uplink mark. Click a port to **inspect** it.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `ports` | `Port[]` | `[]` | See below. |
| `label` | string | — | Plate label (model name). |
| `selected` | `id \| null` | — | Controlled selection. |
| `onSelect` | `(port \| null) => void` | — | Fires with the full port object. |
| `inspect` | bool | `true` | `false` hides the details card. |
| `legend` | bool | `true` | `false` hides the legend. |

### Port

```js
{ id,                       // port number
  status,                   // 'up' | 'down' | 'disabled' | 'error'
  media?,                   // 'rj45' (default) | 'sfp' — SFP groups at the end
  name?, speed?, vlan?,     // inspect-card fields (omit → hidden)
  poe?,                     // true or watts → PoE dot + draw readout
  uplink?,                  // uplink arrow mark
  tx?, rx? }                // traffic readouts (strings)
```

## Behaviour
- Clicking the selected port deselects; the inspect card live-announces (`aria-live`).
- Tiles are real buttons ≥ 32 px, keyboard focusable, with full aria labels.
- Status / PoE / uplink legend translates; port digits stay LTR in RTL.

## Notes
- Tiles are pure CSS (no SVG); tones from the semantic tokens, dark twins included.
- Distinct from **TopologyMap** (Batch 21) — that draws the network graph between devices; PortPanel is one device's physical faceplate.

## Figma
No dedicated node — the Product / device pages are branded frames (declined on IP grounds); this faceplate abstraction is original, toned with the semantic palette.
