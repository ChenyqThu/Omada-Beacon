# Result — `Omada.Result`

Thin wrapper over antd `Result` — the full-page feedback state. A `tone` convenience maps to antd's `status` and swaps the cartoon glyph for an OmadaIcon on a tinted disc, so success/error/warning/info read in the product's own line-icon language:

| `tone` | icon | colour |
|---|---|---|
| `success` | `check-circle` | brand green |
| `error` | `ban` | red |
| `warning` | `warning` | orange |
| `info` | `info` | blue |

The numeric pages (`status="403" \| "404" \| "500"`) keep antd's built-in illustration.

**Figma:** no dedicated Result frame exists in the file — built **token-first** from the Empty / Illustration style + the semantic colour ramp. This was a token-only decision (no Figma node to match); raise it if a bespoke illustration is wanted.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `tone` | `success\|error\|warning\|info` | — | Omada convenience → status + OmadaIcon disc. |
| `status` | antd statuses | — | Use directly for `403/404/500` (keeps antd art). |
| `icon` | `node` | tone disc | Override the glyph. |
| `title` / `subTitle` / `extra` | — | — | Forwarded; localize via `window.t()`. |

## Theming
- Disc colour reads the live `mode` via `useOmada()` and picks the light/dark semantic hex; tint is the hex + alpha suffix.
- Disc layout + extra-row spacing → `omada-overrides.css` `.omada-result-icon` / `.ant-result-extra`.

## Do / Don't
- ✅ Pass `extra` as an array of `OmadaButton`s — they pick up the green/secondary tokens.
- ❌ Don't mix `tone` with a numeric `status`; the wrapper ignores `tone` for numeric pages by design.
