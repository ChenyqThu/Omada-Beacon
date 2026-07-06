# ShortcutsOverlay — `Omada.ShortcutsOverlay`

The keyboard **shortcuts help** overlay — the "press `?` for help" sheet. Where
the Batch-17 `CommandPalette` carries a short reference, this is the full
**categorised legend**: grouped sections (Navigation / Actions / View /
Editing), each a list of `<kbd>` chord rows, with a filter box and
platform-aware `⌘`/`Ctrl`.

`window.Omada.ShortcutsOverlay` · demo `window.OmadaDemos.ShortcutsOverlay`

## Behaviour
- `?` opens it from anywhere — **ignored while typing** in an input / textarea /
  contenteditable; the trigger button opens it too; `Esc` closes.
- Type to filter rows by label across every group; empty groups hide.
- Chords render as `<kbd>` chips; a **"then"** separator handles sequence chords
  (`G` then `D`). `⌘` vs `Ctrl` (and `⌥` vs `Alt`) detected from the platform.

## Props
| Prop | Type | Notes |
|---|---|---|
| `groups` | `[{ key, title, icon?, items: [{ keys: [], label }] }]` | Override the default map. A `keys` entry equal to the "then" word renders as a sequence separator. |

Strings via `window.t()` (`sc.*`). Mount under `OmadaThemeProvider`.

## Tokens / styling
Trigger, modal panel, group grid and the `<kbd>` chips are theme-var driven with
`[data-omada-theme="dark"]` twins in `omada-overrides.css`; kbd accents use the
brand-green token, and the chip styling matches the CommandPalette reference.
Modal radius/shadow come from tokens. Mirrors under RTL. No hard-coded brand hex
in the `.jsx`.

## Notes
- Pairs with `CommandPalette` (run actions) and `SearchResults` (find data) — the
  three "keyboard-first" surfaces share `<kbd>` styling and platform detection.

## Figma
No dedicated node — an antd-6 Modal composition; `<kbd>` styling matches the
CommandPalette reference. Glyphs are `OmadaIcon`.
