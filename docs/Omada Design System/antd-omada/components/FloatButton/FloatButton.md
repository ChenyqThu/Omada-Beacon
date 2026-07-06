# FloatButton — `Omada.FloatButton` (`.Group`, `.BackTop`)

Corner-pinned action affordance: a single round button, a hover speed-dial `Group`, and `BackTop`. Thin antd `<FloatButton>` wrapper — brand-green primary disc + shadow come from tokens.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'default' \| 'primary'` | `'default'` | Maps to antd `type`; `primary` = brand-green fill. |
| `iconName` | `string` | — | OmadaIcon name (size 18). `icon` overrides. |
| `tooltip` | `node` | — | Forwarded; route text through `window.t()`. |

`FloatButton.Group` takes the same `iconName` convenience for its trigger. `FloatButton.BackTop` re-exported as-is.

**i18n:** tooltip strings via `window.t()` (`float.*`). **Figma:** floating-action / back-to-top chrome pattern.
