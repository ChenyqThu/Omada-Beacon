# Drawer — `Omada.Drawer`

Thin wrapper over **antd `Drawer`** with Omada defaults from the Figma "Drawer 抽屉": **380** default width (the device-detail / filter panel width), **right** placement, the OmadaIcon close glyph, and the drawer shadow (`#2B2B2B` 10% / black 24% dark, via `token.boxShadowSecondary`). 16px radius lives in `components.Drawer`.

**Figma:** Drawer 抽屉 — node `25331:112308` + the `/Drawer` specimens (device detail, filter panel; right & left placement).

| Prop | Default | Notes |
|---|---|---|
| `width` | `380` | Figma panel width; widen for rich detail. |
| `placement` | `right` | `left` for filters, `right` for detail. |
| `closeIcon` | OmadaIcon `close` | Pass `null` to hide. |
| `footer` | — | Apply / Cancel node, pinned to the bottom (filter pattern). |
| `extra` | — | Header-right slot — a StatusPill reads well here. |
| *(all antd Drawer props)* | | `open`, `onClose`, `title`, `mask`, … forwarded. |

## Do / Don't
- ✅ Put a sticky Apply / Cancel pair in `footer` for filter / edit drawers (the form can be long).
- ✅ Use `extra` for a status pill or quick action next to the title.
- ❌ Don't use a Drawer for a short confirm — that's `Omada.Modal` / `useModal`.
