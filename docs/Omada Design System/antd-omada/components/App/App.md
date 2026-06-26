# App — `Omada.App` + `useOmadaApp()`

The antd-6 **recommended feedback pattern**, wrapped for Omada. antd 6 deprecates
the static `message.success()` / `notification.open()` / `Modal.confirm()` calls
because they render **outside** React's context — they miss the active
`ConfigProvider` theme, locale and direction. A toast fired from a dark, 中文,
RTL screen comes out light, English, LTR.

`<App>` mounts a context holder; `App.useApp()` returns message / notification /
modal instances that live **inside** the tree, so every toast, banner and confirm
dialog inherits the Omada theme, the zhCN/enUS locale and the RTL direction.

## Exports

| Export | What it is |
|---|---|
| `Omada.App` | Thin `<App>` with Omada-tuned message/notification defaults. Forwards all antd `App` props. |
| `useOmadaApp()` | `App.useApp()` → `{ message, notification, modal }`. The **only** way to reach feedback in the library. |

## Omada defaults

| Channel | Defaults |
|---|---|
| `message` | `top: 16`, `maxCount: 3`, `duration: 3` |
| `notification` | `placement: 'topRight'`, `top: 24`, `maxCount: 4`, `duration: 4.5` |

Override per-instance via the `message` / `notification` props — they shallow-merge
over the Omada defaults.

## Usage

```jsx
// 1. A holder is mounted once at the root (ThemeProvider already renders <App>).
//    Nest Omada.App only to SCOPE different defaults to a subtree.

// 2. Reach feedback through the hook — never the static import.
function SaveButton() {
  const { message, modal } = window.useOmadaApp();
  return (
    <Button onClick={() => message.success(t('app.msgSaved'))}>Save</Button>
  );
}

// 3. Scope defaults to a subtree:
<Omada.App notification={{ placement: 'bottomRight' }}>
  <Panel />
</Omada.App>
```

## Rule

**Never** call the static `message` / `notification` / `Modal` imports in product
code — they break theme, locale and RTL. Always go through `useOmadaApp()`.

## Theming / i18n

No bespoke colour — the toasts/dialogs are the Message / Notification / Modal
wrappers, already token-driven with dark twins. Demo chrome is keyed under
`app.*` via `window.t()`; antd's own button labels come from `ConfigProvider locale`.

**Figma:** no node — this is an antd-6 architecture primitive, not a visual one.
The visuals it produces map to the Message (`Message` node) / Notification /
Modal wrappers.
