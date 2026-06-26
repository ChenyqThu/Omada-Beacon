# Segmented — `Omada.Segmented`

Thin wrapper over antd `Segmented` — the inline view / range switch (Day · Week · Month, or List · Grid · Map). The selected thumb sits on a grey-100 track, lifts on a white card with the soft Omada shadow, and uses green text. Options can carry a leading OmadaIcon. Sizes sm / default / lg, plus `block`.

**Figma:** no dedicated antd-Segmented frame exists — built **token-first** to match the Tabs / Radio.Button visual family (a token-only call). The Slider "有级分段" in the Figma is a different control (graduated slider) handled by `Omada.Slider`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `options` | `array` | — | `{ value, label }` or strings. |
| `value` / `onChange` | — | — | Controlled; or `defaultValue`. |
| `size` | `small\|middle\|large` | `middle` | 26 / 34 / 42 track heights (tokens). |
| `block` | `boolean` | — | Fill the container width. |
| `disabled` | `boolean` | — | — |

**Helper:** `Segmented.iconOption(value, label, iconName)` builds an option with a leading OmadaIcon.

## Theming
- Track bg, item colour, green selected text → `omada-theme.js` `components.Segmented` (light + dark).
- Selected-thumb shadow + 500 weight → `omada-overrides.css` `.ant-segmented-item-selected` (dark twin).

## Do / Don't
- ✅ Use `iconOption()` so glyphs route through OmadaIcon, never inline `<svg>`.
- ✅ Localize labels via `window.t()`.
- ❌ Don't use Segmented for >5 options or long labels — reach for Tabs or Select instead.
