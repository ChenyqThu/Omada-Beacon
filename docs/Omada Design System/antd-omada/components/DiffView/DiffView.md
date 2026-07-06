# DiffView — `window.Omada.DiffView`

A before ↔ after **compare view**. The "review changes before apply" /
config-rollback surface: a field-by-field diff with a summary of how many values
were added, removed or changed, a **split ↔ unified** toggle and a "changes only"
filter.

Pure presentational composition over antd **Segmented / Switch** + Omada **Icon**.
Add = green, remove = red, change = amber tints from the semantic ramp; dark twins
in `omada-overrides.css`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `Item[]` | `[]` | `{ key, label, before, after, group? }`. Empty/null `before` ⇒ added; empty/null `after` ⇒ removed. |
| `defaultMode` | `'split' \| 'unified'` | `'split'` | initial layout. |
| `beforeLabel` / `afterLabel` | `node` | i18n | column captions in split mode. |

Each row is auto-classified: **added** (no before) · **removed** (no after) ·
**changed** (both differ) · **unchanged**. Booleans render as `on` / `off`.

## Modes

- **Split** — `before | after` side by side; old side tinted error, new side
  tinted success, changed rows highlight both.
- **Unified** — a `− old` / `+ added` patch pair per row in one column.

The "changes only" switch hides unchanged rows; `group` renders sticky section
headers with a per-group change count.

## i18n

Chrome via `window.t()` under `diff.*` (verified en + zh). Field labels / group
names passed in.

## Do / Don't

- **Do** group by config section so a long diff stays scannable.
- **Don't** show raw JSON blobs — pass human field labels and formatted values.

## Figma

Config-review / change-confirm language (page **43:34741** review panel). Glyphs
are OmadaIcon (plus / minus / compare / edit). No branded art.
