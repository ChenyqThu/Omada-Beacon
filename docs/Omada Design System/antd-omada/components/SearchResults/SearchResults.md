# SearchResults — `Omada.SearchResults`

A global **spotlight search** surface. Where the Batch-17 `CommandPalette` runs
**actions**, this searches **data**: it filters a mixed corpus of entities
(devices, sites, clients, pages) and shows them **grouped by type**, with the
matched substring highlighted, a type icon, a meta line and a status pill where
relevant — the "search everything" overlay of a large console.

`window.Omada.SearchResults` · demo `window.OmadaDemos.SearchResults`

## Behaviour
- `⌘/` · `Ctrl+/` (or the trigger) opens; `Esc` closes.
- Type to filter across name + meta + keywords; hits regroup under their entity
  type, each group capped at `groupLimit` with a "+N more" line.
- `↑` / `↓` move the active row **across groups** (wraps); `Enter` opens it via
  `onOpen(entity)`; the active row stays in view. Empty query shows **recent**
  (the last few opened), falling back to a seeded preview.
- Matched characters are wrapped in `<mark>` (token-tinted green, not a new hue).

## Props
| Prop | Type | Notes |
|---|---|---|
| `corpus` | `[{ id, type, icon, name, meta, status?, kw? }]` | Searchable set. `type` ∈ device / site / client / page. Omit for the seeded set. |
| `onOpen` | `(entity) => void` | Fired on Enter / click. |
| `groupLimit` | `number` | Max rows shown per group. Default 4. |

Strings via `window.t()` (`srch.*`, reuses `cmd.foot.*`). Mount under
`OmadaThemeProvider`.

## Tokens / styling
Trigger, panel, grouped rows, the `<mark>` highlight and the active row are
theme-var driven with `[data-omada-theme="dark"]` twins in
`omada-overrides.css`; active row + marks use the brand-green token. Modal
radius/shadow come from tokens. `⌘` vs `Ctrl` is detected from the platform.
Mirrors under RTL. No hard-coded brand hex in the `.jsx`.

## Figma
`搜索框✅` (node `3:20722`) — the search dropdown's 4px-radius panel, grouped
rows and soft elevation. We keep the structure, drop the branded header, and
route every string through `window.t`.
