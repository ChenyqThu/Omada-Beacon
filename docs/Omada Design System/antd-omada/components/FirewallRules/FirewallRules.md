# FirewallRules

Ordered ACL rule list: name / source / destination / port / protocol / action rows evaluated top-down. Drag the grip to re-prioritise (index renumbers live), per-row enable switch, allow = brand green chip, deny = red chip. A pinned dashed "Default policy — allow all" row sits last and cannot be dragged. Add rule appends a disabled deny template.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `rules` | `{id, name, src, dst, port, proto, action, on}[]` | 4-rule demo set | string fields starting with `acl.` are translated, anything else renders verbatim (e.g. `'53'`, `'TCP'`) |
| `className` | `string` | — | merged onto the root |

## Behaviour

- HTML5 drag and drop: drop target shows a green top edge; reorder splices the array, the `#` column re-renders.
- Disabled rows keep their position (dimmed) and still drag.
- The default-policy row is presentational — no grip, no switch.

## Figma

SYMBOL `25947:12247` ("Property 1=acl") — no full ACL frame; the drag affordance follows SortableList, chips follow Tag metrics. Distinct from FilterBuilder (query builder) and AlarmRules (threshold → notify).
