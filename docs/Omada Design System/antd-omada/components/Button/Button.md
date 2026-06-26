# Button — `Omada.Button` / `Omada.IconButton`

Thin wrappers over antd `Button`. All antd props forward through; `variant`, `icon`, and `iconSize` are Omada conveniences.

**Figma:** node `41:30099` (Button 按钮) · variants from sub-symbols `26923:26929` (Primary), `3:27352` (Secondary), `26923:5415` (Outline), Text/Link/Danger.

## `Omada.Button`

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'default' \| 'dashed' \| 'text' \| 'link' \| 'danger' \| 'danger-outline' \| 'danger-text' \| 'danger-link'` | `'default'` | Maps to antd `type`/`danger` (+ a class for the two neutral fills antd can't express). |
| `icon` | `string \| ReactNode` | — | A string is resolved to `<OmadaIcon name=…>`; a node passes through. |
| `iconSize` | `number` | tracks `size` (13/14/18) | Icon px. |
| …antd `Button` props | | | `size`, `loading`, `disabled`, `danger`, `href`, `onClick`, etc. |

## `Omada.IconButton`

Icon-only button, circular by default (Omada toolbar/FAB style). **Always pass `label`** — it becomes `aria-label` + `title`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `icon` | `string \| ReactNode` | — | Required. |
| `label` | `string` | — | Required for a11y. Route through `t()`. |
| `variant` | as above | `'text'` | |
| `shape` | `'circle' \| 'default'` | `'circle'` | |

## Variant → visual

- **primary** — brand-green fill, white text, no shadow.
- **secondary** — grey fill (`#F4F4F4`), neutral text. Dark: `#2A2A2A`.
- **outline** — white, green border + green text, fills green-50 on hover.
- **text / link** — no chrome; link is green.
- **danger / danger-outline / danger-text** — Omada red.

## Tokens

Heights (24/32/40), 3px radius, 500 weight, flat (no shadow) all come from `omada-theme.js → components.Button`. The grey/green neutral fills live in `omada-overrides.css` (`.omada-btn-secondary`, `.omada-btn-outline`) with `[data-omada-theme="dark"]` twins. **No brand hex in this component.**

## Do / Don't

- ✅ `<Button variant="primary">{t('common.apply')}</Button>`
- ✅ `<IconButton icon="refresh" label={t('common.refresh')} />`
- ❌ Don't hard-code colours or set `style={{background:'#00A870'}}`.
- ❌ Don't ship an icon-only button without `label`.
