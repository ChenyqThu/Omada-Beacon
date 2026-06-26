# Search — `Omada.Search`

Thin wrapper over antd `AutoComplete` + `Input`. Matches the Figma "Searchbox 搜索框".

**Figma:** Searchbox 搜索框 node `43:34737` — 260×32 filled-grey field (`#F4F4F4`), 4px radius, grey placeholder, trailing search glyph, clear (✕) once typed, results dropdown with an illustrated "No Data" empty state. States Normal / Hover / Focus (green border) / Done / Clear / Disabled.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `placeholder` | `string` | `t('search.ph')` | |
| `options` | `{ value, label? }[]` | — | Autocomplete suggestions; omit for a plain search field. |
| `onSearch` | `(value) => void` | — | Fires on Enter **and** after `debounce` ms of typing. |
| `onSelect` | `(value, option) => void` | — | When a suggestion is chosen. |
| `debounce` | `number` | `600` | Auto-search delay (Figma spec: 3s; tune per surface). |
| `allowClear` | `boolean` | `true` | Clear ✕ restores the default list. |
| `disabled` | `boolean` | `false` | |
| `width` | `number` | `260` | |

Plus all antd `AutoComplete` props.

## Visuals

The filled field, hover, green focus border, suffix icon colour and the dropdown empty-state padding live in `omada-overrides.css` (`.omada-search`, `.omada-search-pop`, + dark twins). antd's `colorBgContainer`/border tokens can't express the always-filled grey resting state, so it's a small CSS layer.

## Do / Don't

- ✅ Debounced `onSearch` for live device filtering; Enter forces an immediate search.
- ✅ Empty `options` → the dropdown shows the localized "No Data" state.
- ❌ Don't add a separate "Search" button — the glyph + Enter + debounce are the affordance.
