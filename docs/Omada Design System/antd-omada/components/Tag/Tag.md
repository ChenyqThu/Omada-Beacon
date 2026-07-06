# Tag — `Omada.Tag` / `Omada.StatusPill`

Thin wrappers over antd `Tag`. Forward all antd props.

**Figma:** `/Tag` page. Status words per root `README.md` → Content Fundamentals.

## `Omada.Tag` (rectangular, 4px radius)

| Prop | Type | Notes |
|---|---|---|
| `tone` | `'success' \| 'processing' \| 'warning' \| 'error' \| 'neutral'` | Omada convenience → antd semantic `color`. |
| `color` | antd color | Overrides `tone`. Pass a hex for marker chips (BETA/NEW/PRO). |
| `closable`, `icon`, … | antd `Tag` props | Forward through. |

## `Omada.StatusPill` (round pill + leading dot)

| Prop | Type | Notes |
|---|---|---|
| `status` | `'connected' \| 'online' \| 'adopting' \| 'pending' \| 'disconnected' \| 'offline' \| 'skipped' \| 'error' \| 'warning'` | Auto-resolves colour **and** the i18n label. |
| `lang` | `'en' \| 'zh'` | For the auto-label. Pass from `useOmada().lang`; falls back to stored lang. |
| `tone` / `color` | | Custom pill colour when not using `status`. |
| `children` | | Custom label; overrides the auto-label. |

Status → colour: connected/online → success · adopting → processing · pending → warning · disconnected/error → error · offline/skipped → default.

## Tokens / CSS

- Radius, font-size, weight: `omada-theme.js → components.Tag`.
- Pill shape, the 6px leading dot, and the translucent semantic fills: `omada-overrides.css` (`.omada-pill`) with `[data-omada-theme="dark"]` twin. **No brand hex in this component** (except deliberate marker-chip hexes passed by the caller).

## Do / Don't

- ✅ `<StatusPill status="connected" lang={lang} />` — label + colour come for free, in both languages.
- ✅ `<Tag tone="warning">{t('status.pending')}</Tag>`
- ❌ Don't hard-code the status English string — use `status` (auto-i18n) or `t()`.
