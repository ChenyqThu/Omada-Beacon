# DnsTable — `window.Omada.DnsTable`

A **record-type-aware editable DNS table**: host (mono) · type chip (tone per type) · value (mono) · TTL · edit/delete. Inline editing swaps the row for controls where the **type drives the value field's placeholder and validation** — A → IPv4, AAAA → IPv6, CNAME → hostname, MX → `priority host`, TXT → free text. Invalid values show a localized reason and block save.

Distinct from **DataGrid** (Batch 20 — generic spreadsheet inline-edit) and **TableInlineCreate** (Batch 24): the schema is the point — per-type editors and validators.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `defaultRecords` | `[{ id, host, type, value, ttl }]` | `[]` | `type ∈ A · AAAA · CNAME · MX · TXT`. |
| `onChange` | `(records) => void` | — | Fires on save/delete. |

## Behaviour
- One editor at a time — other rows' actions disable while editing.
- Changing the type clears the draft value and its error.
- Hosts/values render LTR mono in RTL.

## Figma
Dynamic DNS icon SYMBOL `26455:6756` ("Property 1=Dynamic DNS Service") and illustration `26455:7888` (light) / `26455:10517` (dark) — no record-table frame; row anatomy follows Table/Tag tokens.
