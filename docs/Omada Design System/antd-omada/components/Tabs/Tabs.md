# Tabs — `Omada.Tabs`

Thin wrapper over antd `Tabs`. A `variant` convenience maps to antd's `type`.

**Figma:** Tab 标签页 node `3:15843` — 1.一级Tab (line, active label `#00A870` + 2px green ink bar), 2.大胶囊Tab (large), 3.小标签Tab (card), 4.视图切换Tab (icon view-switch → use `Segmented`, Batch 5).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'line' \| 'card' \| 'editable-card'` | `'line'` | Maps to antd `type`. |
| `size` | `'small' \| 'middle' \| 'large'` | `'middle'` | Standard antd sizes. |
| `items` | `TabItem[]` | — | `{ key, label, children?, disabled?, closable? }`. |
| `centered` | `bool` | `false` | Line tabs centered. |
| `onEdit` | `fn` | — | For `editable-card` add / remove. |

Plus all antd `Tabs` props.

## Visuals

All from `omada-theme.js → components.Tabs` (titleFontSize 14 / lg 15, cardGutter 4, cardPadding `6px 16px`, horizontalItemPadding `8px 0`, itemSelectedColor green, inkBarColor green) + the 2px ink-bar bump in `omada-overrides.css`. No new CSS.

## Do / Don't

- ✅ `variant="line"` for in-page section switching; `variant="editable-card"` for the device-tab pattern.
- ✅ Put an `OmadaIcon` in `label` for iconified tabs.
- ❌ Don't use card tabs for primary page nav — that's the line variant.
