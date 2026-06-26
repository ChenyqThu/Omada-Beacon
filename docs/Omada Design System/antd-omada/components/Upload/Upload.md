# Upload — `Omada.Upload`

Thin wrapper over antd `Upload`. A `variant` prop picks the preset:

- `variant="button"` (default) — a trigger button (`OmadaButton` + upload icon).
- `variant="drag"` — the dashed drop zone (`Upload.Dragger`) with a green hover edge and a centred OmadaIcon.

The wrapper defaults `beforeUpload={() => false}` so demos stay **client-side / presentational** (no network). In a real build, pass your own `action` / `customRequest` (and override `beforeUpload`).

**Figma:** Upload 上传 (page node `43:34738`) — dashed drop zone, green accent on hover, list rows with status colour.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'button' \| 'drag'` | `'button'` | Picks the preset surface. |
| `listType` | `string` | — | `'text'` / `'picture'` / `'picture-card'`. |
| `defaultFileList` | `array` | — | Seed rows with `status: done/uploading/error`. |
| `beforeUpload` | `fn` | `() => false` | Override to actually upload. |
| …rest | — | — | All antd `Upload` props forwarded. |

`Upload.Dragger` and `Upload.LIST_IGNORE` forwarded.

## Theming
- Drag radius, green hover edge, drop-icon colour → `omada-overrides.css` `.ant-upload-drag` / `.omada-upload-icon` (dark twins).
- List status colours come from antd's success/error tokens (already Omada-tuned).

## i18n
- Trigger label, drag prompt, hint via `window.t()`.
- Progress/percent + "remove" tooltip come from antd `ConfigProvider locale`.

## Do / Don't
- ✅ Use the `omada-upload-icon` class on the drop-zone glyph so it inherits the brand green + dark twin.
- ❌ Don't wire real uploads in the gallery — keep `beforeUpload` returning false.
