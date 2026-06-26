# Empty — `Omada.Empty`

Thin wrapper over antd `Empty` — the no-data placeholder. Defaults to antd's **SIMPLE** line illustration (the greyscale outline reads cleanly in light + dark and matches the Omada "faded chart frame" empty pattern better than the default cartoon). A `withAction` slot renders a CTA under the description.

**Figma:** Empty-Space 空状态 (page node `43:34767`, "图表空状态") — a faded frame + caption. The bespoke per-page illustrations are page-specific art and are **not** redrawn; the SIMPLE image is used instead (a token-only call).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `simple` | `boolean` | `true` | `true` → SIMPLE image; `false` → DEFAULT image. |
| `image` | `node` | — | Override the illustration entirely. |
| `description` | `node` | — | Localize via `window.t()`. |
| `withAction` | `node` | — | Renders below the description (hint + CTA). |
| …rest | — | — | All antd `Empty` props forwarded. |

`Empty.PRESENTED_IMAGE_SIMPLE` / `…_DEFAULT` forwarded.

## Theming
- Illustration inherits neutral text/border tokens, so dark mode follows automatically — no custom CSS.

## Do / Don't
- ✅ Pair `description` with a `withAction` CTA (`Add Device`) for first-run empty states.
- ✅ Use the SIMPLE image for in-table / in-card empties; DEFAULT only for large empty pages.
- ❌ Don't hand-draw a bespoke illustration here — if product art is wanted, drop the asset in and pass `image`.
