# SortableList — `Omada.SortableList`

A **drag-to-reorder list** composed from native HTML5 drag-and-drop. antd ships
no sortable primitive, so this is an original Omada wrapper — the pattern for
reordering dashboard widgets, menu items, SSID priority, table columns.

`window.Omada.SortableList` · demo `window.OmadaDemos.SortableList`

## Behaviour
- **Drag** a row by its grip handle (default) or anywhere on the row
  (`handle={false}`). A 2px brand-green **drop indicator** shows the landing
  slot; release commits and fires `onChange`.
- **Keyboard parity** — focus a handle, then `↑`/`↓` (or `Alt+↑`/`Alt+↓`) move
  the row one slot; `Home`/`End` send it to the ends. Focus follows the moved
  row; an `aria-live` status announces each move.
- Controlled (`items` + `onChange`) or uncontrolled (`items` only). RTL-safe.

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `array` | — | Row objects. Controlled when paired with `onChange`. |
| `onChange` | `(next, {key,from,to}) => void` | — | Fires after every reorder (drag or keyboard). |
| `renderItem` | `(item, index) => node` | label/key | Owns row content; chrome (handle, index, indicator) is the wrapper's. |
| `rowKey` | `string` | `'key'` | Field used as React key + reported moved key. |
| `handle` | `bool` | `true` | `false` makes the whole row draggable. |
| `showIndex` | `bool` | `true` | Leading 1-based index badge. |
| `ariaLabel` | `string` | i18n | Listbox label. |

All other props forward to the root. Strings (`srt.*`) come from `window.t()`;
mount under `OmadaThemeProvider`.

## Tokens / styling
Rows reuse the List/Menu row language (8px radius, hairline border). The drop
indicator and active handle use the brand-green token; every rule has a
`[data-omada-theme="dark"]` twin in `omada-overrides.css`. No hard-coded hex in
the `.jsx`.

## Notes
- For very long lists, pair with `VirtualList` — this component is not
  virtualised.
- Native DnD has no touch support on its own; on touch devices fall back to the
  keyboard handles (or wire a pointer-based lib).

## Figma
No dedicated node — a native-DnD interaction pattern. The grip is `OmadaIcon`
`grip-vertical`; rows match the List (Batch 10) / Menu (Batch 4) row spec.
