# BoardView — `Omada.BoardView`

A **kanban board** — drag cards within and **between** columns. Extends the
Batch-18 `SortableList` mechanic from one list to many over native HTML5
drag-and-drop, with a 2px brand-green drop indicator (in any column, including
an empty one) and full keyboard parity.

`window.Omada.BoardView` · demo `window.OmadaDemos.BoardView`

## Behaviour
- **Drag** a card by its grip handle (or anywhere when `handle={false}`); the
  indicator marks the landing slot in whichever column you hover. Release fires
  `onChange(nextColumns, meta)` with the whole columns array.
- **Keyboard:** focus a card → `←` / `→` move it to the previous / next column
  (same slot, clamped), `↑` / `↓` reorder within the column, `Home` / `End` to
  the ends. Focus follows the card; `aria-live` announces column + position.
- Per-column count badge; pass `limit` for a WIP cap that highlights red when
  exceeded.

## Props
| Prop | Type | Notes |
|---|---|---|
| `columns` | `[{ key, title, accent?, limit?, items: [] }]` | The board. |
| `onChange` | `(nextColumns, meta) => void` | Omit for uncontrolled. |
| `cardKey` | `string` | Card key field. Default `'key'`. |
| `renderCard` | `(item, colKey, idx) => node` | Card content. Chrome is ours. |
| `handle` | `bool` | Grip handle (default) vs whole-card drag. |
| `ariaLabel` | `string` | Board label. |

`meta` = `{ key, fromCol, toCol, to }`. Strings via `window.t()` (`bv.*`).

## Tokens / styling
Columns, cards, handle, count badge and the green drop indicator are theme-var
driven with `[data-omada-theme="dark"]` twins in `omada-overrides.css`. Mirrors
under RTL (column order + `←`/`→` semantics flip). No hard-coded brand hex in
the `.jsx`.

## Notes
- Sibling to `SortableList` — same native-DnD core, no drag library, no
  virtualisation. For very long columns, window the card list with `VirtualList`.

## Figma
No dedicated node — a native-DnD interaction pattern. Cards reuse the List /
Menu row language; grip is `OmadaIcon` `grip-vertical`.
