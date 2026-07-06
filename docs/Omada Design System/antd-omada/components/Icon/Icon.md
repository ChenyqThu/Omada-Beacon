# Icon — `Omada.Icon` (`OmadaIcon`)

The single icon primitive. Renders bespoke Omada line icons by name from `window.OMADA_ICONS`, on a 24-grid, driven by `currentColor`.

**Figma:** icon pages `/icon` (node `638:56236` "Icon 规范"), `/icon/Sidebar-icon`, `/icon/Table-icon`, `/Icon-UI`. Clean source SVGs were extracted to `assets/icons/_figma-source/` (refresh `28475:150513`, filter `25947:10956`, trash `Delete`, gear `25947:11495`, cloud `Sidebar-icon`, tools `Main-Button-icon`, edit `Edit`, adopt `25947:11537`).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `name` | `string` | — | Key in `OMADA_ICONS`. Unknown name → quiet empty box + one console warn (never crashes). |
| `size` | `number` | `16` | Use 16 / 20 / 24. |
| `strokeWidth` | `number` | `1.8` | On the 24 grid (≈1.2px at 16, ≈1.8px at 24). |
| `color` | `string` | `currentColor` | Prefer inheriting `currentColor` from context. |
| `title` | `string` | — | Adds `<title>` + `aria-label`; omit for decorative icons (then `aria-hidden`). |

## ⚠️ Source note (read before adding icons)

The brief asked for the **real Omada icons via `fig_copy_files`, not Lucide**. The Figma's per-icon export is **lossy**: a handful export as clean single `currentColor` fill-path SVGs (extracted to `_figma-source/`), but most glyphs are reconstructed as transformed bordered line-segments and zero-height SVGs with no usable path geometry. Copying those raw fragments yields a broken, inconsistent set.

**Decision:** the registry is one consistent, recolourable set — 24-grid, 1.8px rounded-cap line style — transcribed faithfully from the Figma designs (using the extracted clean SVGs as reference). **Lucide has been removed** from all component usage. If you obtain the original vector icon exports (or an icon font), drop the SVGs into `assets/icons/` and replace the matching `OMADA_ICONS` entries — the API doesn't change.

## Adding an icon

Add one entry to `OMADA_ICONS` in `Icon.jsx`: `name: '<inner svg markup on a 0 0 24 24 viewBox, currentColor>'`. Use `fill="none"` stroke shapes for line glyphs; set `fill="currentColor" stroke="none"` on filled bits (dots). Then every component can use it.

## Catalog (Batch 1)

actions: search · refresh · plus · minus · close · check · check-circle · chevron-{down,up,left,right} · arrow-right · more-{vertical,horizontal} · settings · settings-2 · edit · trash · download · upload · export · filter · copy · eye · eye-off · info · warning · ban · help-circle · calendar · clock · external-link
theme/locale: sun · moon · languages
status/device-actions: adopt · reboot · disconnect · move-to-site · power
nav/device-types: dashboard · devices · clients · user · alerts · map · insights · gateway · switch · ap · camera · wifi · globe · bell · lock · cloud
charts/trend (Batch 6+): trending-up · trending-down
Batch 17: printer · keyboard · command · list · layers · braces · corner-down-left
Batch 18: grip-vertical (drag handle) · inbox · file-text · table · check-check (mark-all-read) · panel-right

## Do / Don't

- ✅ `<Icon name="refresh" size={16} />` inside a green-text button → inherits green.
- ✅ Pass `title` for standalone meaningful icons.
- ❌ Don't reintroduce Lucide. Don't inline raw `<svg>` in components — go through `OmadaIcon`.
