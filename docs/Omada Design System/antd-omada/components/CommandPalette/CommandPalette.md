# CommandPalette — 命令面板 / 快捷键

A keyboard-first **command palette** (⌘K / Ctrl+K) plus a shortcut reference
table. antd has no palette primitive, so this composes one from `Modal` +
`Input` + a token-driven result list — the "jump to anything" pattern for a
large console.

`window.Omada.CommandPalette` · demo `window.OmadaDemos.CommandPalette`

## Behaviour
- **⌘K / Ctrl+K** (or the trigger button) toggles open; **Esc** closes.
- Type to fuzzy-filter by label + keywords; results regroup under their section.
- **↑ / ↓** move the active row (wraps); **Enter** runs it; the active row
  scrolls into view inside the list only (never the page).
- Each command shows its `OmadaIcon` + an optional shortcut hint as `<kbd>` chips.
- The platform modifier (`⌘` on Mac, `Ctrl` elsewhere) is auto-detected.

Running a command fires a themed App-context toast (`useMessage`). Two commands
are wired live — **Toggle theme** and **Toggle language** drive `useOmada()`.

## Props
Board component — `className` + standard div props only. Mount under
`OmadaThemeProvider` (renders `<App>`) so `useMessage` resolves.

## Notes
- The active-row highlight + `<kbd>` accents use the brand-green token; surfaces
  are theme vars with dark twins in `omada-overrides.css`.
- The global key listener is removed on unmount.
- Command registry is data — `id` + `icon` + i18n label keys + `keys[]`; extend
  `buildCommands()` to add entries.

## Figma
No dedicated node — an antd-6 composition pattern (Modal + Input + list). Modal
radius/shadow and glyphs come from tokens / `OmadaIcon`.
