# ConflictDialog — `window.Omada.ConflictDialog`

**Concurrent-edit resolution.** Someone else saved this page while you were editing — the dialog lists every conflicting field with both values side by side (**Mine | Theirs**) as selectable cards. Pick per field, or bulk *keep all mine* / *take all theirs*; **Resolve** returns the merged object.

Distinct from **ApprovalFlow** (Batch 23 — a request/approve pipeline) and **AutoSave** (Batch 22 — surfaces *that* a conflict happened). This is the resolution surface itself.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `open` | bool | — | Controlled visibility. |
| `conflicts` | `[{ key, label, mine, theirs, render? }]` | `[]` | `render(v)` customises value display; booleans / null render sensibly. |
| `meta` | `{ actor, when }` | — | Fills the header sentence ("{actor} saved changes … ({time})"). |
| `onResolve` | `(merged, choices) => void` | — | `merged = { key: chosenValue }`, `choices = { key: 'mine' \| 'theirs' }`. |
| `onCancel` | `() => void` | — | — |
| `title`, `width` | — | t(confd.title), 620 | — |

## Behaviour
- Every field defaults to **mine** on open; the footer tally reads "n mine · m theirs" live.
- Value cards are radio-semantics buttons (`role="radio"`, `aria-checked`); the chosen card fills with the side tone (mine → brand green, theirs → blue).
- Resolve is always enabled — defaulting to mine is a valid resolution.

## Notes
- Dark twin, i18n, RTL-mirrored. Modal chrome inherits the Omada modal tokens (radius 12).

## Figma
No dedicated node — dialog chrome from the "Dialog" component group; the two-column value cards are original.
