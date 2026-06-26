# Tooltip — `Omada.Tooltip`

Thin wrapper over **antd `Tooltip`** — the **dark spotlight** hint (distinct from Popover's light bubble). Defaults match the Figma: spotlight surface `rgba(43,43,43,0.96)` (light) / `#383838` (dark) via `token.colorBgSpotlight`, 4–6px radius, 12–14px text, arrow shown, a quick 50 ms enter delay. All colour/radius from `omada-theme.js → components.Tooltip`.

**Figma:** Tooltip 文字提示 — node `3:25676` (12 placement × arrow specimens).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `node` | — | The hint content. |
| `placement` | `top\|bottom\|left\|right\|…` | `top` | 12 placements supported. |
| `mouseEnterDelay` | `number` | `0.05` | Snappier than antd's default. |
| `arrow` | `boolean \| {…}` | shown | Set `false` to drop the arrow. |
| *(all antd Tooltip props)* | | | `open`, `trigger`, `color`, … forwarded. |

## Do / Don't
- ✅ Wrap an icon `Button` to explain it: `<Tooltip title={t('tip.reboot')}><Button icon=…/></Tooltip>`.
- ❌ Don't use Tooltip for rich content with actions — that's `Omada.Popover`.
