# NetworkSelector — `window.Omada.NetworkSelector`

A **hierarchical site / network switcher**. The trigger shows the current `site › network`; the popover holds a search box, a **Recents** group (last 3 picks), and the full site → network tree with the current pick marked. Search filters across both levels (a site-name hit keeps all its networks).

Distinct from **CommandPalette** (Batch 17 — global ⌘K modal over actions/entities): this is a scoped context switcher that lives in the chrome, like a controller header's site dropdown.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `sites` | `[{ id, name, networks: [{ id, name, vlan? }] }]` | `[]` | Two-level hierarchy. |
| `value` | `{ siteId, netId }` | — | Controlled current pick. |
| `onChange` | `({ siteId, netId }) => void` | — | Selection closes the popover. |
| `className` | string | — | Applied to the trigger. |

## Behaviour
- Recents are per-mount (newest first, deduped, capped at 3) and hide while searching.
- Search box autofocuses on open; rows are real `<button>`s (keyboard + 32 px hit targets).
- VLAN chips are quiet mono; the current row shows a green check + "Current".

## Figma
No dedicated switcher frame exists in the file (verified against the mount) — the Site glyph lives at `/icon/components/Site`; popover anatomy follows Dropdown / Menu tokens.
