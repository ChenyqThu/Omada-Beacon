# ColorTokens — `Omada.ColorTokens`

A living swatch board (not a wrapper). **Reads** `window.OMADA` from `omada-theme.js` — the single source of truth — and renders it, so it can never drift from the tokens components actually use. Click a chip to copy its hex.

Groups shown:
- **Brand green ramp** `50→900` (markers on base `500` / hover `400` / press `600`)
- **Neutral ladder** white → grey-950
- **Semantic** success / warning / error / info
- **Chart accent ramp** green → lime → blue → magenta → orange → red
- **Dark surface ladder** canvas / surface / elevated / spotlight / border

No props. **i18n:** group labels via `window.t()` (`tok.*`). **Figma:** Color 色彩 page (node `3:64240`).
