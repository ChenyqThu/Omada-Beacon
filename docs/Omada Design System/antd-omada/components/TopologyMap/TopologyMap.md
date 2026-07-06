# TopologyMap — `window.Omada.TopologyMap`

A connection / network **topology mini-map**. Device nodes (gateway · switch ·
ap · camera · client · cloud) laid out over a canvas and joined by
status-coloured links; each node is a selectable chip (type glyph + label +
status ring), with a legend mapping the statuses.

## Props

| Prop | Type | Notes |
|---|---|---|
| `nodes` | `[{ id, type, label, x, y, status }]` | `x`/`y` are 0..1 normalised canvas positions; `type` is an OmadaIcon device glyph; `status` ∈ `up · degraded · down · idle` |
| `links` | `[{ from, to, status }]` | Node-id pairs; `down` renders dashed |
| `selected` / `defaultSelected` | id | Controlled / uncontrolled selection |
| `onSelect` | `(node, id) => void` | Fires with the node (or null on deselect) |
| `aspect` | number | Canvas height = width × aspect (default 0.52) |
| `legend` | bool | Show the status legend (default true) |

## Behaviour

- Links are the only SVG — straight lines in a `0 0 100 100` viewBox with
  `preserveAspectRatio="none"`, so a line endpoint sits exactly under its node's
  percentage position. `vector-effect:non-scaling-stroke` keeps line weight
  constant.
- Nodes are real `<button>`s (keyboard reachable, `aria-pressed`); selecting one
  lifts it with a brand ring and dims the rest of the graph + unrelated links.
- Status colours come from the semantic success/warning/error tokens + a neutral
  idle; RTL-safe.

## Tokens / CSS

Canvas, node disc tones, status dots, link colours, selection lift and legend
live in `omada-overrides.css` under `.omada-topo*` with a
`[data-omada-theme="dark"]` twin. No hard-coded brand hex in the JSX.

Figma: topology/connection-map pattern — composes the device glyph set + the Card
surface; no single node. Original layout.
