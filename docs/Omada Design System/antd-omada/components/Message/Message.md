# message — `Omada.useMessage()`

Thin wrapper over antd's **message** API. In antd 6 the themed, locale-aware instance comes from `App.useApp()` (wired by `OmadaThemeProvider`), so this is a **hook**, not a component. It returns status helpers that inject the matching OmadaIcon glyph + tone so toasts read in the Omada language. Radius (6px) from `omada-theme.js → components.Message`.

**Figma:** Toast Message 全局提示 — node `2965:16331` (dark twin `3:25954`).

```jsx
function Bar() {
  const msg = Omada.useMessage();
  return <Button onClick={() => msg.success(t('msg.saved'))}>Save</Button>;
}
```

| Method | Glyph / tone | Notes |
|---|---|---|
| `success(content, opts)` | check-circle · green | Default duration 3s. |
| `error(content, opts)` | ban · red | |
| `info(content, opts)` | info · blue | |
| `warning(content, opts)` | warning · orange | |
| `loading(content, opts)` | antd spinner | Sticky (`duration:0`); returns a `hide()` fn. |
| `open(opts)` / `message` | — | Raw App-context escape hatch. |

## Do / Don't
- ✅ Use `loading` → call the returned `hide()` then `success`/`error` for async flows (apply, reboot).
- ✅ Pass already-localised content (`t('msg.saved')`).
- ❌ Don't import the static `antd.message` — it renders outside the themed App context (no dark mode / locale).
