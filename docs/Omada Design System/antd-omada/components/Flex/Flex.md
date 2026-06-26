# Flex — `window.Omada.Flex`

Thin wrapper over antd `Flex` — the low-level flexbox primitive for toolbars, button clusters, KPI rows and form footers. Per `COMPONENT_SPEC`, prefer flex/grid + `gap` over inline flow; this is the token-friendly building block.

## Props

| Prop | Type | Notes |
|---|---|---|
| `vertical` | `boolean` | column direction |
| `justify` | `CSS justify-content` | `flex-start`, `center`, `space-between`, … |
| `align` | `CSS align-items` | `flex-start`, `center`, `flex-end`, … |
| `gap` | `'small' \| 'middle' \| 'large' \| number` | named steps resolve to spacing tokens (8-grid) |
| `wrap` | `boolean \| CSS flex-wrap` | wrapping behaviour |
| `flex` | `CSS flex` | flex shorthand on the container |
| `component` | `string \| Component` | rendered element (default `div`) |
| `className` | `string` | merged after `omada-flex` |
| …antd `Flex` props | | forwarded |

## Notes
- Use the named `gap` steps (`small` / `middle` / `large`) so spacing stays on the design grid rather than ad-hoc pixels.
- Visual-free wrapper — no Omada CSS beyond the `omada-flex` hook. Demo chips (`.omada-flex-box`, `.omada-flex-track`) are demo-only styling.

## i18n
Only the helper hint (`flex.hint`) is localized.

## Figma
No dedicated frame (antd primitive / layout utility). Spacing steps match the **Space** spec.
