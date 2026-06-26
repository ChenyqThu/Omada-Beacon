# SavedViews — `window.Omada.SavedViews`

A global **filter bar with saved views**. FilterBuilder builds one compound query;
SavedViews is the layer above it — a row of named views that each remember a
query, persisted to `localStorage`, with a dirty-aware Update / Save-as-new
affordance and per-view rename / duplicate / delete.

Thin composition over **OmadaFilterBuilder** + antd **Dropdown / Modal / Input** +
Omada **Button / Icon**. The active pill and dirty dot use the brand-green token;
dark twins in `omada-overrides.css`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `fields` | `Field[]` | `[]` | passed straight to FilterBuilder (`{ key, label, type, options?, unit? }`). |
| `views` | `View[]` | `[]` | seed views `{ id, name, rows, icon? }`. Used only on first run — after that localStorage wins. |
| `storageKey` | `string` | `'omada.savedViews'` | persistence key. |
| `defaultActive` | `string` | first view | id of the initially selected view. |
| `onChange` | `({ view, rows }) => void` | — | fires when the active view changes or its query is edited — a table filters here. |

`rows` are normalised `{ field, op, value }` triples (the FilterBuilder commit
shape). A view with `id: 'all'` is treated as the undeletable default.

## Behaviour

- Pick a view → its query seeds the FilterBuilder, `onChange` fires.
- Editing the query marks the view **dirty** (green dot). **Update** writes back,
  **Save as new** forks a view (then prompts a name), **Reset** reverts.
- Views survive reload via localStorage; the ⋯ menu offers Rename / Duplicate /
  Delete on non-default views.

## i18n

Chrome via `window.t()` under `sv.*` (verified en + zh). View names / field
labels passed in.

## Do / Don't

- **Do** ship a small set of seed views that match real operator segments.
- **Don't** persist huge datasets here — views store *queries*, not rows.

## Figma

Table-toolbar filter + saved-segment language (page **43:34741**). Pills reuse the
Segmented / Tag radius; glyphs are OmadaIcon. No branded art.
