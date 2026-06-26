# WidgetGrid — `window.Omada.WidgetGrid`

A re-orderable, **resizable dashboard**. The "customise dashboard" surface where
an operator drags KPI / chart / list tiles around and sets each to span 1, 2 or 3
columns. Native HTML5 drag-and-drop (the SortableList engine in 2D) + a per-tile
width control. No antd tile-grid exists; this composes one.

Thin chrome over a CSS grid + antd **Segmented** (the size control) + Omada
**Icon**. Tile bodies are caller-rendered. Drop ring and active grip use the
brand-green token; dark twins live in `omada-overrides.css`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `tiles` | `Tile[]` | `[]` | `{ key, title, icon?, span? }`. `span` clamps to `columns`. |
| `onChange` | `(tiles, meta) => void` | — | Fires on reorder / resize / remove. `meta = { key, type, from?, to?, span? }`. **Controlled** when present. |
| `onRemove` | `(key) => void` | — | Also fires on tile removal. |
| `renderTile` | `(tile, i) => node` | title | Tile body content. |
| `columns` | `number` | `3` | Grid track count. |
| `rowHeight` | `number` | `132` | Min tile height (px). |
| `removable` | `boolean` | `true` | Show the per-tile × control. |

## Interaction

- **Drag** a tile by its header grip onto another tile → green ring marks the
  target, release inserts before it.
- **Resize** via the header S / M / L segmented (or `[` / `]` on the focused grip).
- **Keyboard** on the grip: `←/→` move one slot · `↑/↓` jump a row (±columns) ·
  `Home/End` to the ends · `[` / `]` shrink / grow span. Focus follows the tile;
  a polite live region announces each move.

## i18n

Chrome via `window.t()` under `wg.*` (verified en + zh). Tile titles are passed in.

## Do / Don't

- **Do** keep the column count to 3–4 on desktop; the grid reflows to 1 column
  under 720px (see the responsive rule).
- **Don't** put a scroll region inside a tile — size tiles to their content.

## Figma

No dedicated node — a native-DnD dashboard pattern. Tiles reuse the Card language
(8px radius, hairline border) and the SortableList grip (`grip-vertical`).
