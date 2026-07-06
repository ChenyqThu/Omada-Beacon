# DeviceIcon

Real Omada **device-type, client & model icons**, extracted from the source Figma
"DeviceIcon" set as full-colour **vector SVGs** (topology / device-list / client glyphs).
Scalable and retina-crisp; they carry their own colours (not `currentColor`).

```jsx
const { DeviceIcon } = window.Omada;

<DeviceIcon device="ap" size={40} />
<DeviceIcon device="iphone" size={40} />
<DeviceIcon device="eap650" size={56} showLabel />
```

## Props
| prop | type | default | notes |
|---|---|---|---|
| `device` | string | — | key in `window.OMADA_DEVICE_ICONS` |
| `size` | number | `40` | height in px; width scales to aspect |
| `showLabel` | bool | `false` | render the label under the glyph |
| `base` | string | `assets/device-icons/` | folder relative to the host page |

## Set (37)
- **infra** — ap, ap-group, switch, l3-switch, gateway, router, controller, internet, stack, nvr, ipc, camera-group, child-ipc
- **client** — iphone, android, macbook, imac, computer, pad, tv, ipod, usb, harddisk, scanner, client-group, other
- **model** — eap650, eap787, eap650-outdoor, eap650-wall, er8411, er7212, tl-er7206, tl-sg2008p, tl-sg2428p, es205gp, dr3650

Add more by dropping the SVG in `assets/device-icons/` (models in
`assets/device-icons/models/`) and adding a registry entry. The full Figma
"DeviceIcon" library has ~90 entries (more specific models + dark variants) —
extend as needed.
