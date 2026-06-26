# Select — `Omada.Select`

Thin wrapper over antd `Select`. Swaps the dropdown arrow for the Omada chevron (`OmadaIcon "chevron-down"`); forwards every antd prop. `.Option` / `.OptGroup` attached.

**Figma:** `/Select` page.

| Prop | Type | Notes |
|---|---|---|
| `suffixIcon` | `ReactNode` | Override the default Omada chevron. Pass `null` to remove. |
| …antd `Select` props | | `mode`, `options`, `showSearch`, `allowClear`, `loading`, `disabled`, `optionFilterProp`, etc. |

## Tokens

`optionSelectedBg` (green-50 / green-20% dark), `optionSelectedColor` (green text), `optionActiveBg`, 4px radius, 32px height — all in `omada-theme.js → components.Select` (light + dark). No CSS override; no hard-coded colour.

## i18n

- **Option labels** are product data — translate via `t()` (see device-type options using `net.*` keys).
- **Built-in empty / loading / "Not found"** text comes from antd's `ConfigProvider locale` (set by `OmadaThemeProvider`) — do **not** re-translate those.

## Do / Don't

- ✅ `<Select options={deviceTypes} />` where labels use `t('net.ap')` etc.
- ❌ Don't restyle the selected-option highlight — it's a token.
