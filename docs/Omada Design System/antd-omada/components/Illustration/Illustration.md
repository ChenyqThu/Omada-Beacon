# Illustration — `Omada.Illustration` / `window.OmadaIllustration`

Original Omada spot illustrations for empty / error / notice states. Drawn to
the **"Illustration 插画规范"** system rules — line + flat fill, **square
corners**, neutral `#999` line, white surface, pale-green `#E3F1EE` fill, and a
single **small** accent pop from the Omada ramp. These are an *original
redraw* in that style, not the branded source artwork.

Built as a name registry like `OmadaIcon` (one entry = one scene), from
geometric primitives only, so the whole set sits on one 160×120 grid.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `name` | scene key | — | See the set below. Unknown names warn once and render a blank box. |
| `size` | `number` | `120` | Height in px; width scales to the 4:3 stage. (Or size with CSS.) |
| `accent` | CSS color | scene default | Recolours the single accent element — set per-instance via `--om-illus-accent`. |
| `title` | `string` | — | Adds an SVG `<title>` + `aria-label`; otherwise the SVG is `aria-hidden`. |

## Scene set

**Empty-state** (30° top-down): `no-data` · `no-results` · `no-devices` ·
`offline` · `world` · `report` · `inbox-empty`

**Function / status** (front view, Figma "功能插图 / 状态插图"): `dns` ·
`email` · `bind-list` · `email-sent` · `download-failed` · `firmware-update` ·
`success` · `error` · `notice` · `lock-failed` · `power-failed` ·
`maintenance` · `no-permission` · `timeout`

Add a scene by adding one entry to `OMADA_ILLUS` ( `{ accent, svg }` ) — keep
to primitives, square corners, one small accent area.

## Theming

Line / surface / fill are CSS variables (`--om-illus-line`, `--om-illus-surface`,
`--om-illus-fill`) defined in `omada-overrides.css` with a
`[data-omada-theme="dark"]` twin, so scenes flip cleanly in dark mode. The
accent is a per-instance var (ramp colours read on both themes). No brand hex
hard-coded in the JSX beyond the registry's ramp accents.

**Figma:** Illustration 插画规范 node `666:59603` + Empty-Space 图表空状态 node
`13644:14162` (page `43:34767`). Original redraw — no branded artwork copied.
