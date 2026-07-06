# ImageField — `window.Omada.ImageField`

A preview-first image input — drop or pick images and see them immediately, as a round avatar or a reorderable gallery. Distinct from **Upload** (Batch 5 — a generic antd file list / dragger) and **UploadQueue** (Batch 20 — multi-file transfer progress). The ImageField is image-specific and preview-first; it surfaces **local** previews (FileReader data URLs) that the surrounding form submits later. Cropper-less — images cover their frame via `object-fit`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `mode` | `'avatar' \| 'gallery'` | `'gallery'` | Single circular slot vs reorderable tile grid. |
| `value` / `onChange` | item(s) / fn | — | Controlled. Avatar → one item (or `null`); gallery → array. Or `defaultValue`. |
| `max` | number | `8` (gallery) | Caps tiles; the add tile hides at the cap. |
| `shape` | `'circle' \| 'rounded' \| 'square'` | avatar→`circle`, gallery→`rounded` | Frame shape. |
| `size` | number | avatar `104`, tile `92` | Px. |
| `accept` | string | `'image/*'` | File input accept. |
| `maxSizeMB` | number | `5` | Per-file size cap; over → `onError('size')`. |
| `onError` | `(reason, file?) => void` | — | `'type'` / `'size'` / `'max'`. |
| `showPrimary` | boolean | `true` | Gallery: tag the first tile "Primary". |

Item shape: `{ id, url, name?, size? }`.

## Behaviour
- **Drop or click** the zone to add. Avatar replaces; gallery appends up to `max`.
- **Gallery reorder** by dragging tiles (native DnD); the first tile is the primary.
- **Validation** rejects non-images and oversize files via `onError` — the field itself stays quiet (the host decides how to surface it).

## Usage

```jsx
<Omada.ImageField mode="avatar" value={avatar} onChange={setAvatar} onError={notify} />

<Omada.ImageField mode="gallery" value={photos} onChange={setPhotos} max={6} onError={notify} />
```

## Notes
- Dark twin, i18n, RTL-mirrored (overlay, remove buttons and add tile flip via logical properties).
- No network transfer — previews are data URLs. Wire a real upload on submit.

## Figma
No dedicated node — derives from the picture-card Upload language (`Upload`, `3:17xxx`). The preview-first avatar / gallery field is original to the Omada library.
