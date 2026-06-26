# Badge — `Omada.Badge`

Thin wrapper over **antd `Badge`** — the numeric badge / dot on icons, tabs and list items. `tone` is an Omada convenience that maps to the semantic ribbon colour; everything else forwards straight to antd. Metrics (`fontSize 11`, `fontWeight 700`) live in `omada-theme.js → components.Badge`.

**Figma:** Badge 徽标数 — node `3:25644` (count · 99 · 99+).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `tone` | `success \| error \| warning \| info \| neutral` | — | Maps to the antd colour token for the standalone/dot badge. |
| `count` | `number \| node` | — | Numeric badge. |
| `dot` | `boolean` | — | Small dot, no number. |
| `overflowCount` | `number` | `99` | "99+" cap. |
| `status` | `success \| processing \| error \| warning \| default` | — | Status dot + `text`. |
| *(all antd Badge props)* | | | `offset`, `showZero`, `color`, `size`, … forwarded. |

`Badge.Ribbon` re-exposed.

## Do / Don't
- ✅ `<Badge count={128} overflowCount={99}><IconPlate/></Badge>`
- ✅ `<Badge status="success" text={t('status.online')} />`
- ❌ Don't pass raw hex for semantic states — use `tone` / `status`.
