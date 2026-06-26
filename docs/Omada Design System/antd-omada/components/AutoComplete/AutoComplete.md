# AutoComplete — `window.Omada.AutoComplete`

Thin wrapper over antd `AutoComplete` — a free-text field that suggests as you type (quick-find a device by name / IP, jump to a site). Distinct from `Search` (the filled-grey search box); this is the bordered input + suggestion popup.

## Props

| Prop | Type | Notes |
|---|---|---|
| `prefixIcon` | `string` | OmadaIcon name rendered inside the field (embeds an `Input` child) |
| `options` | `Option[] \| Group[]` | flat options or `{ label, options }` groups |
| `value` / `onChange` | `string` / `(v) => void` | controlled text |
| `onSelect` | `(value, option) => void` | fired when a suggestion is chosen |
| `onSearch` | `(value) => void` | fired as the user types |
| `filterOption` | `boolean \| (input, option) => boolean` | client-side filtering |
| `allowClear` | `boolean` | default `true` |
| `disabled` | `boolean` | |
| `status` | `'error' \| 'warning'` | validation state |
| `popupClassName` | `string` | merged after `omada-ac-pop` |
| `className` | `string` | merged after `omada-ac` |
| …antd `AutoComplete` props | | forwarded |

## Notes
- For grouped suggestions, pass `options` as `[{ label: <groupTitle/>, options: [...] }]`. Group titles render as mono lowercase labels in this kit.
- Use `prefixIcon` for the embedded-icon variant; otherwise pass plain `options` (or an `<Input>`/`children`) for the bordered field.

## i18n
Chrome strings via `window.t()` (`ac.*`, `common.disabled`).

## Theming
Popup background, option hover and grouped-section titles in `omada-overrides.css` (`.omada-ac-pop …` + dark twin). Green focus ring is the shared Omada input family. No brand hex in the JSX.

## Figma
No dedicated frame (antd primitive). Matched against **Select `43:34731`** and **Searchbox `43:34737`**.
