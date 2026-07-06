# DependencyHint — `window.Omada.DependencyHint`

A **setting-dependency callout** — "Enabling *Deep Packet Inspection* requires *Traffic Logging*". Sits under the dependent control, lists each prerequisite with its live On/Off state, and offers **one-click Enable** buttons (plus *Enable all* when several are off). When everything is satisfied it flips to a quiet success note — or hides with `hideWhenMet`.

Distinct from **HintPopover** (Batch 23 — explanatory hover content) and **FormValidation** (Batch 13 — value errors): this expresses a relationship *between settings*, with the fix inline.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `feature` | string | — | The dependent setting's label (fills the sentence). |
| `requires` | `[{ key, label, enabled, onEnable? }]` | `[]` | Live state from the caller; omit `onEnable` for a read-only prerequisite. |
| `mode` | `'enable' \| 'disable'` | `'enable'` | Disable variant warns the other way: "Disabling {a} will also disable …". |
| `hideWhenMet` | bool | `false` | Render `null` once all requirements are on. |

## Behaviour
- Unmet → info-toned callout; all met → success tone + "All requirements met".
- *Enable all* appears when ≥ 2 requirements are off and all have `onEnable`.
- Each requirement row: state dot (✓ when on), label, On/Off readout, Enable button.

## Notes
- Token washes (info / success) with dark twins; i18n; RTL-mirrored.
- The component never flips state itself — `onEnable(key)` hands control back to the form.

## Figma
No dedicated node — callout anatomy follows Alert; the requirement rows are original.
