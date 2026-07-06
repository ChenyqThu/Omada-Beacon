# Mentions — `window.Omada.Mentions`

Thin wrapper over antd `Mentions` — a multi-line text field with `@`-prefixed autocomplete for tagging teammates inside device notes, audit comments and change requests.

## Props

| Prop | Type | Notes |
|---|---|---|
| `options` | `{ value, label }[]` | suggestion entries (antd 6 preferred over `Option` children) |
| `value` / `onChange` | `string` / `(text) => void` | controlled text |
| `onSearch` | `(text, prefix) => void` | fired as the user types after a prefix |
| `prefix` | `string \| string[]` | trigger character(s), default `'@'` |
| `split` | `string` | inserted around a chosen mention, default `' '` |
| `autoSize` | `boolean \| { minRows, maxRows }` | grow with content |
| `rows` | `number` | fixed height alternative |
| `status` | `'error' \| 'warning'` | validation state |
| `disabled` | `boolean` | |
| `className` | `string` | merged after `omada-mentions` |
| …antd `Mentions` props | | forwarded |

## Composition / helpers
- `Mentions.Option` — re-exported for the children API.
- `Mentions.getMentions(text, config)` — re-exported helper to parse chosen mentions out of the value.

## i18n
Chrome strings via `window.t()` (`mention.*`, `common.disabled`).

## Theming
Field radius, green focus ring and the suggestion menu live in `omada-overrides.css` (`.omada-mentions …` + dark twin), matching the Omada TextArea. No brand hex in the JSX.

## Figma
No dedicated frame (antd primitive). Matched against **Input2 / TextArea `43:34721`** and **Dropdown menu `3:64442`**.
