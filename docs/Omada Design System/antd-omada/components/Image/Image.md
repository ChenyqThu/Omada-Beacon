# Image — `Omada.Image` (`.PreviewGroup`)

Image with click-to-preview (zoom / rotate / flip). antd `<Image>` + `<Image.PreviewGroup>` own the lightbox; the wrapper adds an 8px Omada frame + hairline (token radius + CSS hook, dark twin) and a localized OmadaIcon preview-mask label.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `framed` | `boolean` | `true` | 8px radius + hairline border. |
| `src` | `string` | — | Image source. |
| `preview` | `object \| false` | localized mask | Overrides merge over the Omada default mask. |

`Image.PreviewGroup` re-exported. The demo uses striped SVG placeholders (no hand-drawn art). **i18n:** mask label `image.preview`. **Figma:** device-photo / topology tiles from `/Product` + `/Display`.
