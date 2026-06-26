# Cascader — `Omada.Cascader`

Thin wrapper over antd `Cascader` — the multi-column region/location picker (Region › City › Site). Adds the OmadaIcon chevron suffix, the per-column chevron-right expand icon, 4px radius, green active-option tint, and a 260px default control width. Single + `multiple`, `showSearch`, and `changeOnSelect` (pick any level) supported.

**Figma:** Cascader 级联选择 (page node `43:34729`) — control matches Select 选择器; columns use the green selected tint + chevron expand icon.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `options` | `array` | — | antd shape `{ value, label, children }`. |
| `changeOnSelect` | `boolean` | — | Emit a value at every level, not just leaves. |
| `multiple` | `boolean` | — | Checkbox multi-select; value is an array of paths. |
| `showSearch` | `boolean` | — | Flat path search. |
| `expandIcon` | `node` | OmadaIcon `chevron-right` | Per-column expander. |
| `suffixIcon` | `node` | OmadaIcon `chevron-down` | Pass `null` to drop it. |
| …rest | — | — | All antd `Cascader` props forwarded. |

`Cascader.Panel` forwarded for the inline (no-dropdown) panel.

## Theming
- Active/hover option tints → `omada-theme.js` `components.Cascader` (`controlItemBgActive` green-50, light + dark).
- Control radius/height inherit Select tokens; dropdown shadow from `omada-overrides.css`.

## Do / Don't
- ✅ Use `maxTagCount="responsive"` in `multiple` mode.
- ✅ Localize every `label` + placeholder via `window.t()`.
- ❌ Don't fix the control width to the English label — `style={{ width }}` is a min, content can be shorter in 中文.
