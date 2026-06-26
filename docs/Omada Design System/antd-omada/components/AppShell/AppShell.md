# AppShell — `Omada.AppShell`

Product chrome: antd `Layout` + the Omada green `Header` top bar + a collapsible `Sider` holding an `Omada.Menu` + a content region with optional breadcrumb / title / extra. The one wrapper that composes multiple antd primitives instead of wrapping a single one — but every colour still comes from tokens / `.omada-topbar` CSS.

**Figma:** Top Bar 顶部栏 node `285:6342` (green bar gradient `#038069 → #026E64`, height 56, logo + org switcher + centre text nav + right icon cluster) · Sidebar 侧边导航栏 node `1198:20546` (216px sider, 36px rows, left accent bar).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `menuItems` | `MenuItem[]` | — | antd Menu `items` (use `window.omadaMenuItem` to build). |
| `selectedKeys` / `defaultSelectedKeys` | `string[]` | `['dashboard']` | Active menu key. |
| `openKeys` / `defaultOpenKeys` | `string[]` | — | Expanded submenus. |
| `onMenuSelect` / `onOpenChange` | `fn` | — | Forwarded to the Menu. |
| `collapsed` / `defaultCollapsed` | `bool` | `false` | Sider collapsed state (controlled or uncontrolled; the top-left button toggles it). |
| `onCollapse` | `fn` | — | Fires on toggle. |
| `breadcrumb` | `node` | — | Rendered above the title row. |
| `title` | `node` | — | Page H1. |
| `extra` | `node` | — | Right-aligned actions in the title row. |
| `showServiceNav` | `bool` | `true` | Centre Cloud / On-Premises / Account-Manager nav. |
| `children` | `node` | — | Content body. |

## Behaviour

- The **top-right cluster** (search · refresh · notifications badge · theme toggle · help · account menu) is wired live: the theme toggle calls `toggleMode()`, and the account menu's language row calls `setLang()` from `useOmada()`.
- The **green top bar** is a gradient (`.omada-topbar`) — antd can't express it as a token. The dark twin keeps the brand green for continuity, matching the theme's `Layout.headerBg`.
- Header height (56) + `siderBg` come from `omada-theme.js → components.Layout`.

## Do / Don't

- ✅ Build `menuItems` with `window.omadaMenuItem(t, OmadaIcon, { key, icon, labelKey, beta, children })`.
- ✅ Pass a localized `breadcrumb` (use `Omada.Breadcrumb`) and `title`.
- ❌ Don't hard-code the top-bar green — it lives in `.omada-topbar`.
