# ThemeExport — Token 导出 / 差异

A **token-export & light↔dark diff** board. It reads the real config objects
(`window.omadaThemeLight` / `omadaThemeDark`, the same ones `getOmadaTheme()`
feeds `ConfigProvider`) so what it shows and copies can never drift from what
the library actually applies.

`window.Omada.ThemeExport` · demo `window.OmadaDemos.ThemeExport`

## Two views (Segmented)
1. **Diff** — curated seed tokens grouped (brand / semantic / text / surface /
   border / shape+motion). Each row shows the **light** value and the **dark**
   value side by side with a colour swatch; rows that change between modes get a
   `Δ` "differs" flag, making the light↔dark contract auditable. Click any value
   to copy it.
2. **JSON** — the **active mode's** full `token` block, pretty-printed and
   copyable in one click — the exact object to paste into a real
   `theme={{ token }}`.

A summary line reports the active mode and how many of the listed tokens differ.

## Props
Board component — `className` + standard div props. Reads the active mode from
`useOmada()`; toggle Light/Dark in the toolbar to switch which mode the JSON
view exports.

## Notes
- Swatches are the token values themselves — no new colour invented.
- Only seed (`token`) values are surfaced; component-level overrides live in
  `omada-theme.js` under `components.<Name>` and are out of scope for the board.
- Copy uses `navigator.clipboard`; it silently no-ops where the API is blocked.

## Figma
No node — a token-architecture board over `omada-theme.js`.
