# Alert — `Omada.Alert`

Thin wrapper over **antd `Alert`** — the inline, in-page status banner (distinct from the transient `message` toast and the top-right `notification` card). Omada defaults: an OmadaIcon glyph per type, a `tone` alias for antd's `type`, and `showIcon` on. Tinted fills (e.g. `rgba(0,168,112,0.10)` success) come from the Alert colour tokens in `omada-theme.js` (light + dark); the 3px left accent strip from `omada-overrides.css`. Radius 6px (token).

**Figma:** Alert 警告提示 — node `3:25828` (success / info / warning / error; icon + leading-dot variants; dark twin under `/Alert/Alert-dark`).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `tone` | `success\|info\|warning\|error` | — | Alias for antd `type`. |
| `message` | `node` | — | The headline line. |
| `description` | `node` | — | Optional supporting paragraph. |
| `action` | `node` | — | Trailing button(s) — e.g. Update / Learn more. |
| `closable` | `boolean` | `false` | Adds the OmadaIcon close glyph. |
| `banner` | `boolean` | `false` | Full-width, square top-of-page strip. |
| `showIcon` | `boolean` | `true` | Set `false` for a text-only alert. |
| *(all antd Alert props)* | | | `onClose`, `icon`, … forwarded. |

## message vs notification vs Alert
- **Alert** — persistent, lives **in the page** layout. Conditions / context ("3 devices need a firmware update").
- **message** — transient toast, no title, auto-dismiss.
- **notification** — top-right titled card for events.

## Do / Don't
- ✅ Use `description` + `action` for an alert the user should act on.
- ✅ Use `banner` for page-top maintenance / outage strips.
- ❌ Don't use an Alert for a fire-and-forget confirmation — that's `useMessage().success`.
