# PoeBudget

PoE power-budget panel: editable budget (W), Figma-matched "Remaining PoE power" header (value pair over a 6px bar), per-port rows with device, 802.3 class chip, priority select, allocated watts and a PoE on/off switch. Oversubscription preempts lowest-priority ports first (low → medium, highest port number first); preempted rows dim with a struck wattage and a `Preempted` tag.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `defaultBudget` | `number` | `65` | Total PoE budget in watts (editable in the header, 20–740 W) |
| `ports` | `{port, device, cls, watts, prio}[]` | 8-port demo set | `device` is an i18n key or `null`; `prio` is `high\|medium\|low` |
| `className` | `string` | — | merged onto the root |

## Behaviour

- Active draw = Σ watts of enabled ports minus preempted ports; remaining = budget − draw.
- Bar tone: green < 70 %, orange < 90 %, red ≥ 90 % or any preemption.
- Preempt order: priority ascending (low → medium → high), then port number descending.

## Figma

Frame `25331:112308` ("Remaining PoE Power" header — value `23.1W/132.60W` + 6px bar, green bolt) · bolt SYMBOL `25947:11987`. Row metrics follow CertManager / DnsTable lists. Distinct from PortPanel (faceplate) and VlanMatrix (membership grid).
