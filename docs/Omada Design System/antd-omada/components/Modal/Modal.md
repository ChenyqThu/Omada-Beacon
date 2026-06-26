# Modal — `Omada.Modal` + `Omada.useModal()`

Thin wrapper over **antd `Modal`** with Omada defaults from the Figma "Dialog 对话框": **12px radius** (token), **480** default width, **centered**, the OmadaIcon close glyph, and a header bottom-rule + 18px title (`omada-overrides.css`). OK / Cancel labels come from antd `ConfigProvider locale`; product copy via `window.t()`.

**`Omada.useModal()`** returns the **App-context** modal API (themed + locale-aware in antd 6 — use it instead of the static `Modal.confirm`) plus three presets that inject the right OmadaIcon and tone:

| Preset | Glyph / tone | Use for |
|---|---|---|
| `confirmDelete({title, content, onOk, okText})` | warning · red, danger OK | Destructive, irreversible actions. |
| `confirmDiscard({title, content, onOk})` | warning · orange | Leaving with unsaved edits. |
| `info({title, content})` | info · blue | Acknowledge-only notices. |
| `modal` | — | Raw App-context instance for custom cases. |

Each preset forwards any extra props to `modal.confirm` / `modal.info`.

**Figma:** Dialog 确认框 — node `3:26637` (info / confirm / loading dialogs).

| `Modal` prop | Default | Notes |
|---|---|---|
| `width` | `480` | Figma default dialog width. |
| `centered` | `true` | Omada dialogs are vertically centered. |
| `closeIcon` | OmadaIcon `close` | Pass `null` to hide. |
| *(all antd Modal props)* | | `open`, `onOk`, `onCancel`, `footer`, … forwarded. |

## Do / Don't
- ✅ Reach for `useModal().confirmDelete` for destructive flows — it ships the warning glyph + red OK for free.
- ✅ Use the controlled `<Modal open>` form for dialogs that host a form.
- ❌ Don't call the static `antd.Modal.confirm` — it renders outside the themed App context and won't pick up dark mode / locale.
