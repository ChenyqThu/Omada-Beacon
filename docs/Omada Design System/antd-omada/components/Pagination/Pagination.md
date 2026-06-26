# Pagination — `Omada.Pagination`

Thin wrapper over **antd `Pagination`**. Defaults match the Figma "默认分页": the **size changer** is on, and a **localized total readout** ("Showing 1-10 of 200") is rendered via `window.t('pagination.total')`. antd's own strings ("/ page", "Go to") come from `ConfigProvider locale` — pass `lang` only to localize OUR total string.

**Figma:** Pagination 分页 — node `3:16180` (default / simple / mini variants). `itemSize 32` from tokens.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `lang` | `'en' \| 'zh'` | localStorage | Localizes the total string only. |
| `showSizeChanger` | `boolean` | `true` | The "10 / page" selector. |
| `showTotalText` | `boolean` | `true` | Set `false` to hide the Omada total readout (e.g. for `simple`). |
| `showTotal` | `fn` | auto | Pass your own to fully override the readout. |
| *(all antd Pagination props)* | | | `total`, `current`, `pageSize`, `simple`, `size`, `showQuickJumper`, … forwarded. |

## Do / Don't
- ✅ `<Pagination lang={lang} total={200} pageSize={10} />`
- ✅ `<Pagination simple showTotalText={false} total={200} />`
- ❌ Don't translate "/ page" yourself — that's an antd locale built-in.
