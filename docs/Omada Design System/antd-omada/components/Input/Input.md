# Input — `Omada.Input`

Thin wrapper over antd `Input`. Forwards all antd props; adds `prefixIcon` / `suffixIcon`.

**Figma:** `/Input` and `/Input2` pages.

| Prop | Type | Notes |
|---|---|---|
| `prefixIcon` | `string \| ReactNode` | String → `<OmadaIcon size=15>` in placeholder grey. Ignored if `prefix` is set. |
| `suffixIcon` | `string \| ReactNode` | Same, for the suffix slot. |
| …antd `Input` props | | `placeholder`, `allowClear`, `disabled`, `status`, `addonAfter`, etc. |

Sub-components are attached and inherit Omada tokens: `Omada.Input.Search`, `.Password`, `.TextArea`, `.Group`, `.OTP`.

## Tokens

4px radius, 32px height, 12px inline padding, and the **3px green focus ring** (`activeShadow` 12% light / 22% dark, `activeBorderColor` brand green) all live in `omada-theme.js → components.Input` (light + dark). No CSS override needed; no hard-coded colour here.

## i18n

Placeholders are the one place "please…" is allowed (root README). Route them through `t()` (`field.siteName.ph`, `field.password.ph`, `field.search.ph`). Validation/help text is product copy — also via `t()` in real use.

## Do / Don't

- ✅ `<Input prefixIcon="globe" placeholder={t('field.siteName.ph')} />`
- ❌ Don't restyle the focus ring inline — it's a token.
