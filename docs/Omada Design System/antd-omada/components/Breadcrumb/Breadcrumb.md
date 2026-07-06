# Breadcrumb — `Omada.Breadcrumb`

Thin wrapper over antd `Breadcrumb`. The Omada signature is a **slanted-slash separator** (`/` tilted ≈15°, `#999`) instead of antd's default `>`.

**Figma:** separator `icon/斜杠` in Pagination 分页器 node `3:16180` — `Rectangle-6`, 1.371px wide, rotated ~15°, fill `#999999`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `Crumb[]` | — | `{ title, href?, onClick?, menu? }`. Leading icon = a node in `title` (use `OmadaIcon`). |
| `separator` | `node` | slanted `/` | Override only if you must; default is the brand slash. |

Plus all antd `Breadcrumb` props.

## Visuals

- Item colours — `omada-theme.js → components.Breadcrumb` (itemColor `#636363`, lastItemColor `#2B2B2B`, linkHoverColor green; dark twins seeded).
- Separator tilt + colour — `.omada-breadcrumb-sep` in `omada-overrides.css` (with a dark twin).

## Do / Don't

- ✅ Last item is the current page (no `href`) — renders in the strong colour.
- ✅ Use a `menu` on a crumb for sibling navigation (renders the chevron).
- ❌ Don't swap the separator back to `>` — the slash is the Omada signature.
