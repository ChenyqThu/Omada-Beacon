# List — `window.Omada.List`

Thin wrapper over antd `List` for device rosters, activity feeds and grid inventories. Adds the `omada-list` class for hover / meta / header-footer chrome; forwards every antd prop. `List.Item` and `List.Item.Meta` are re-exported.

## Props

| Prop | Type | Notes |
|---|---|---|
| `dataSource` | `any[]` | rows to render |
| `renderItem` | `(item, index) => ReactNode` | usually returns a `<List.Item>` |
| `header` / `footer` | `ReactNode` | optional chrome |
| `grid` | `object` | `{ gutter, xs…xl, column }` for a responsive card grid |
| `loadMore` | `ReactNode` | footer-area "load more" affordance |
| `pagination` | `object \| false` | antd pagination config |
| `size` | `'small' \| 'default' \| 'large'` | row density |
| `bordered` | `boolean` | outline + row dividers |
| `split` | `boolean` | row separators (default `true`) |
| `loading` | `boolean \| SpinProps` | skeleton / spinner state |
| `className` | `string` | merged after `omada-list` |
| …antd `List` props | | forwarded |

## Composition
- `List.Item` — one row; supports `actions` (right-aligned action cluster) and `extra` (trailing meta).
- `List.Item.Meta` — `avatar` + `title` + `description`.

## i18n
All chrome strings via `window.t()` (`list.*`, `li.*`). antd's empty state translates via `ConfigProvider locale`.

## Theming
Row hover, meta-title weight and header/footer borders live in `omada-overrides.css` (`.omada-list …` + `[data-omada-theme="dark"]` twin). No brand hex in the JSX.

## Figma
No dedicated frame — List is rendered through the kit's table-row + card-meta vocabulary. Matched against **Table `43:34741`** and **Card `25331:85805`**.
