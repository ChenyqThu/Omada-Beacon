# DhcpReservation

DHCP scope + static-lease table. Scope strip: fixed `192.168.0.0/24` network with an editable dynamic-pool start/end pair (subnet + ordering validation). Reservation rows (MAC → IP, hostname) edit inline; live validation blocks Save on malformed MAC, IP outside the subnet, duplicate IP or duplicate MAC. An IP inside the dynamic pool gets a warning chip (honoured but flagged), not an error.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `reservations` | `{id, mac, ip, host}[]` | 3-row demo set | `host` starting with `dhcpr.` is treated as an i18n key |
| `className` | `string` | — | merged onto the root |

## Behaviour

- MAC accepts `:` or `-` separators and normalises to uppercase-dash on save.
- Conflict checks compare against other rows' committed or in-flight drafts.
- Cancel on a new row removes it; on an existing row reverts the draft.

## Figma

SYMBOL `26455:7659` ("DHCP") — no full frame; table metrics follow DnsTable / CertManager. Distinct from DnsTable: validation here is cross-row (conflicts) and range-based (subnet/pool), not per-record-type syntax.
