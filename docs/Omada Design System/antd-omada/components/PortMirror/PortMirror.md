# PortMirror

Port-mirror session editor: a 10-port strip where clicking toggles source membership (filled green with a direction glyph), a destination Select (sources excluded; the destination gets a DST ring and can't be clicked as a source), a Tx/Rx/Both Segmented, and an enable switch gated on validity. A summary line spells the session out; enabling shows a live dot.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `portCount` | `number` | `10` | ports rendered on the strip |
| `defaultSources` | `number[]` | `[1, 3, 5]` | initial source ports |
| `defaultDest` | `number` | `8` | initial destination port |
| `className` | `string` | — | merged onto the root |

## Behaviour

- Mutual exclusion: picking a destination strips it from sources; the destination ignores strip clicks.
- Any topology edit while enabled flips the session back off (re-arm deliberately).
- Port order stays LTR under RTL, matching PortPanel / VlanMatrix.

## Figma

SYMBOL `1830:2964` ("设备=Switch, 图标=Mirror-镜像口") — no full frame; port squares follow PortPanel metrics. Distinct from PortPanel (faceplate status) and VlanMatrix (membership grid).
