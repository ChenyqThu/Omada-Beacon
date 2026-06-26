# Mask — `window.Omada.Mask`

The overlay scrim. antd bakes its mask into Modal/Drawer/Image; the Omada
Figma specs it as a **reusable** dimming layer for loading states, blocking
confirms, and spotlight focus. Original component, but still token-/CSS-driven
— the scrim colour comes from a CSS var (antd `colorBgMask`), with a
`[data-omada-theme="dark"]` twin in `omada-overrides.css`.

## Props

| prop | type | default | notes |
|---|---|---|---|
| `open` | bool | `false` | fades in/out |
| `container` | `'parent'` · `'fullscreen'` | `'parent'` | absolute (fills nearest positioned ancestor) vs fixed (viewport). Parent must be `position: relative`. |
| `tone` | `'dark'` · `'light'` | `'dark'` | dim a light surface vs frost a dark one |
| `blur` | bool | `false` | backdrop-blur the content beneath |
| `closable` | bool | `false` | clicking the scrim itself fires `onClose` |
| `onClose` | fn | — | scrim-click handler |
| `zIndex` | number | `1000` | stacking |
| `children` | node | — | optional centred content (spinner, confirm card) |

```jsx
<div style={{ position:'relative' }}>
  …panel…
  <Mask open={loading} blur><Spin tip="Applying…" /></Mask>
</div>
```

## Do / Don't
- **Do** wrap the scrim around a `position: relative` container for inline blocking; use `container="fullscreen"` for app-wide locks.
- **Don't** rebuild Modal/Drawer dimming with this — those ship their own mask. Use Mask for the cases antd leaves uncovered.

## Figma
- `Mask 遮罩` — node **3:27258**.
