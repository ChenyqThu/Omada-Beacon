# Elevation — `Omada.Elevation`

A living board for the elevation (shadow) + radius tokens (not a wrapper). **Reads** the `boxShadow` values straight off `window.omadaThemeLight` / `omadaThemeDark`, re-reading the dark set when the theme flips, so the cards demonstrate the exact shadows components use.

Shows:
- **Shadow ladder** sm / md / lg with usage (card · drawer · dropdown)
- **Radius scale** button 3 · input/tag 4 · card/menu 8 · modal 12 · drawer 16 · pill 999

No props. **i18n:** labels via `window.t()` (`elev.*`). **Figma:** Shadow 投影 page (node `559:34761`).
