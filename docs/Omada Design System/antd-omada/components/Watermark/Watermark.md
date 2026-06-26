# Watermark — `Omada.Watermark`

Repeating tamper-evident overlay for sensitive panels (config exports, topology snapshots, account screens). antd `<Watermark>` wrapper that defaults the font to a faint Omada mark sourced from the **active theme** (light → neutral @ low alpha, dark → light text @ low alpha), so it never hard-codes a colour.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `content` | `string \| string[]` | — | Watermark text. Route through `window.t()`. |
| `font` | `object` | merged Omada default | Overrides merge over the themed default. |
| `gap` | `[x, y]` | `[120, 100]` | Tile spacing. |
| `rotate` | `number` | `-22` | Tile angle. |

All antd `Watermark` props forwarded. **Figma:** confidentiality overlay pattern (account / export screens).
