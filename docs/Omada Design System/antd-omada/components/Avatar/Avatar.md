# Avatar — `Omada.Avatar`

Thin wrapper over **antd `Avatar`** (`+ Avatar.Group`). Omada conventions: default shape `circle`, default fallback icon = `OmadaIcon "user"`, and a `tone` that tints the initials/icon background with a brand-family colour. The wrapper reads the app's `data-omada-theme` and picks the dark tint automatically. Sizes follow the Figma top-bar avatars (32 default, 48 hover/menu).

**Figma:** Avatar 头像 — node `2985:128851` (32px / 48px specimens).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `tone` | `brand \| blue \| magenta \| orange \| neutral` | — | Tints the fallback bg/fg (ignored when `src` is set). |
| `size` | `number \| 'small'\|'default'\|'large'` | `default` | Use 32 / 48 for top-bar avatars. |
| `icon` | `node` | `OmadaIcon "user"` | Auto fallback when no `src`/children. |
| `src` | `string` | — | Image; disables tone tint. |
| *(all antd Avatar props)* | | | `shape`, `gap`, `onError`, … forwarded. |

`Avatar.Group` re-exposed (use `max={{ count }}` for the "+N" overflow).

## Do / Don't
- ✅ `<Avatar tone="brand">SJ</Avatar>` · `<Avatar size={48} src="…"/>`
- ❌ Don't hard-code the tint hexes — they come from `window.OMADA` (light + dark).
