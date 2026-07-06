# Workspace — `Omada.Workspace`

A **three-pane workspace** — list ↔ detail ↔ inspector — built from nested antd
Splitters. The mail / IDE / device-console layout: pick on the left, read in the
middle, tweak on the right, drag the seams to rebalance. Extends the Splitter
wrapper (Batch 9) to three panes.

`window.Omada.Workspace` · demo `window.OmadaDemos.Workspace`

## Behaviour
- **List** is a single-select nav; choosing a row drives the detail + inspector.
- **Inspector** is collapsible — a panel-toggle in the detail header (and the
  Splitter's own collapse affordance) hides/shows it; the detail reclaims width.
- Every seam drags within min/max so no pane vanishes by accident; sizes persist
  for the session. Panes scroll independently inside one bordered card.

## Props
| Prop | Type | Notes |
|---|---|---|
| `items` | `array` | List rows. First is selected by default. |
| `rowKey` | `string` | Key field. Default `'key'`. |
| `renderRow` | `(item, i) => node` | List row content. |
| `renderDetail` | `(item) => node` | Center pane for the selected item. |
| `renderInspector` | `(item) => node` | Right pane for the selected item. |
| `selectedKey` / `onSelect` | controlled selection | Omit for internal state. |
| `listTitle` / `detailTitle` / `inspectorTitle` | `string` | Pane headers (default i18n). |
| `height` | `number` | Workspace height. Default 460. |

Strings come from `window.t()` (`ws.*`); mount under `OmadaThemeProvider`.

## Tokens / styling
Drag bars inherit the green-on-hover hairline from the Splitter wrapper. Pane
headers, list rows and the card frame are theme-var driven with
`[data-omada-theme="dark"]` twins in `omada-overrides.css`. Mirrors under RTL
(panes reorder start→end). No hard-coded hex in the `.jsx`.

## Notes
- Pure composition over `Omada.Splitter` — no new drag mechanics.
- For a two-pane master/detail, use `Splitter` directly; reach for Workspace when
  the inspector earns its own column.

## Figma
Master/detail layout from `/Layout` (node `3:64434`) — the same node the
Splitter wrapper cites, extended to three panes. Glyphs are `OmadaIcon`
(`list` / `docs` / `settings` / `panel-right`).
