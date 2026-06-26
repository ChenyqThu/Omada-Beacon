# SettingsPage — `Omada.SettingsPage`

A sectioned **settings** composition with a dirty-aware **sticky save bar**. The
long-form preferences page: a left rail of section anchors, stacked titled
sections (icon + title + description on the left, controls on the right), and a
save bar that slides up the instant a value changes — "Unsaved changes ·
Discard · Save".

`window.Omada.SettingsPage` · demo `window.OmadaDemos.SettingsPage`

## Behaviour
- One antd `Form` owns every section. `onValuesChange` diffs the current values
  against the saved **baseline**; the save bar appears only while **dirty**.
- **Save** → `onSave(values)`, the baseline resets, the bar slides away and a
  brief "Saved" pulse confirms. **Discard** → fields revert to the baseline.
- The left rail **scroll-spies** the sections (click to jump); on narrow widths
  it collapses and sections stack full-width.

## Props
| Prop | Type | Notes |
|---|---|---|
| `sections` | `[{ key, title, desc?, icon?, render(form) }]` | `render` returns the section's `Form.Item`s. |
| `initialValues` | `object` | The saved baseline. |
| `onSave` | `(values) => void` | Fired on Save (after the baseline resets). |

Strings via `window.t()` (`set.*`). Mount under `OmadaThemeProvider`.

## Tokens / styling
Rail, section frames, the save bar and the saved pulse are theme-var driven with
`[data-omada-theme="dark"]` twins in `omada-overrides.css`; the active rail item
+ save bar use brand-green tokens, the bar slides via the §0 motion token.
Mirrors under RTL (rail moves to the end). No hard-coded brand hex in the `.jsx`.

## Notes
- Pure composition over antd `Form` — every control is a normal `Form.Item`, so
  validation, `Form.useWatch` and dependent fields work unchanged.
- For a step-by-step flow instead of a long page, use `FormWizard` (Batch 18).

## Figma
`页面布局-Settings` (node `12014:56155`) — the sectioned form page with grouped
blocks and a persistent action bar. Glyphs are `OmadaIcon`.
