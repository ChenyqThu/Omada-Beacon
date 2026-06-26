# FormWizard — `Omada.FormWizard`

A **multi-step wizard** — antd `Steps` + a single `Form` instance with per-step
validation and a review summary. The "create a site / adopt a gateway / onboard
a tenant" flow that every console rebuilds; it lives here once.

`window.Omada.FormWizard` · demo `window.OmadaDemos.FormWizard`

## Behaviour
- **One Form spans all steps** — values persist across Back/Next; stepping away
  and back loses nothing.
- **Next validates only the current step** via `form.validateFields(step.fields)`.
  A failing field blocks advance and is surfaced inline; a passing step turns
  its Steps node green (finish).
- A trailing **review step** reads `form.getFieldsValue()` into a read-only
  `Descriptions` summary before Finish.
- **Finish** runs a full `validateFields()` then `onFinish(values, form)`;
  return a promise to show the footer loading state.

## Props
| Prop | Type | Notes |
|---|---|---|
| `steps` | `Array<{ key, title, icon?, fields?, content }>` | `content` is a node or `(form, helpers) => node`; `fields` lists the names validated on Next. |
| `onFinish` | `(values, form) => void \| Promise` | Called after final validation. Promise → footer loading. |
| `initialValues` | `object` | Forwarded to the Form. |
| `direction` | `'horizontal' \| 'vertical'` | Steps orientation (default horizontal; auto-stacks narrow). |
| `form` | antd FormInstance | Optional external instance. |

Strings come from `window.t()` (`fw.*`); mount under `OmadaThemeProvider`.

## Tokens / styling
Steps active/finished nodes use the brand-green token (inherited from the Steps
wrapper). Footer, review card and field grid are theme-var driven with
`[data-omada-theme="dark"]` twins in `omada-overrides.css`. No hard-coded hex in
the `.jsx`.

## Notes
- The wizard owns navigation + validation only; each step owns its fields, so
  any antd form control works inside.
- `requiredMark` is on; rely on antd `rules` for messages (routed through
  `window.t()` in the demo).

## Figma
No dedicated node — composes the Steps wizard node (Batch 4) with the Form
language (Batch 3). Glyphs are `OmadaIcon`.
