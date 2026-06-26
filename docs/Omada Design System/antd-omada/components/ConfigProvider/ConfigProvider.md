# ConfigProvider — `Omada.ConfigProvider`

A thin convenience over antd's `ConfigProvider` for **scoped presets**. The app
is already wrapped once by `OmadaThemeProvider` (which owns the Omada theme,
locale and direction); this nests *inside* that to retheme or resize a region
without re-declaring the whole theme — antd merges nested providers.

## Convenience props

| Prop | Type | Maps to | Notes |
|---|---|---|---|
| `size` | `'small' \| 'middle' \| 'large'` | `componentSize` | Resizes every control in the subtree at once. |
| `compact` | `boolean` | `theme.compactAlgorithm` | Layered onto the inherited algorithm (read from `window.antd.theme`) for dense panels. |
| `wave` | `boolean \| { disabled, showEffect }` | `wave` | `true` keeps the default brand-green ripple (derived from `colorPrimary`); `false` disables it; an object is forwarded. |
| `disabled` | `boolean` | `componentDisabled` | Freezes the whole subtree. |

All other antd `ConfigProvider` props (`theme`, `locale`, `direction`,
`getPopupContainer`, `form`, `space`, …) are forwarded. When both `compact` and
an incoming `theme.algorithm` are present, the compact algorithm is appended,
not replaced — so dark + compact compose.

## App message context

The shell wraps the tree in antd 6's `<App>` (see `ThemeProvider.jsx`), so
`message` / `notification` / `Modal` use the themed, locale-aware instance.
Reach it with `const msg = window.Omada.useMessage()` — never the static
`message.*` API, which renders outside the ConfigProvider and loses the theme.

**Tokens:** no component tokens of its own — it only re-scopes the theme from
`omada-theme.js`. No brand hex in the JSX (the green wave derives from
`colorPrimary`).

**Figma:** antd primitive — no dedicated frame. Pairs with the theme token
board (Color node `3:64240`).
