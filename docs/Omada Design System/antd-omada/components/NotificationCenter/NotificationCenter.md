# NotificationCenter — `Omada.NotificationCenter`

A **persistent inbox drawer**. Transient toasts vanish; the events you must not
miss also land here, openable any time. antd has no inbox primitive — this
composes one over Drawer + Badge + a token-driven list.

`window.Omada.NotificationCenter` · demo `window.OmadaDemos.NotificationCenter`

## Behaviour
- **Trigger button** carries a `Badge` of the unread count (caps 99+, hidden at
  zero). Opening reveals the drawer.
- **Filter tabs** — All · Unread · one tab per tone present (alert / success /
  info / error), each with its own count.
- **Read state** — rows are unread until clicked; click marks read and drops the
  badge. "Mark all read" clears the column; per-row ✕ dismisses; "Clear all"
  empties the inbox.
- Rows show a tone disc (`OmadaIcon`), title, one-line body, relative time.
  Empty filters render the Omada `Empty` illustration.

## Props
| Prop | Type | Notes |
|---|---|---|
| `items` | `Array<{ id, tone, read, ts, title, body }>` | Seed list. `tone` ∈ alert/success/info/error; `ts` is epoch ms. |
| `onChange` | `(next) => void` | Fires on every read/dismiss/clear so callers can persist. |
| `triggerLabel` | `string` | Override the trigger button label. |

Self-managing (owns read/dismiss state internally, seeded from `items`). Mount
under `OmadaThemeProvider`; strings come from `window.t()` (`nc.*`). Drawer is
the Omada Drawer wrapper — themed, locale + RTL aware.

## Tokens / styling
Tone discs reuse the semantic tone tokens (success/warning/error/info); the
unread dot and active tab use brand green. Every rule has a
`[data-omada-theme="dark"]` twin in `omada-overrides.css`. No hard-coded hex in
the `.jsx`.

## Notes
- Inbox vs toast: fire a toast for the immediate action and append the same
  event here for the durable record — they are complementary, not either/or.
- Relative timestamps are computed at render; for a live clock, re-render on an
  interval upstream.

## Figma
No dedicated node — an inbox pattern over the Drawer (Batch 3), Badge (Batch 2)
and Empty (Batch 5). Glyphs are `OmadaIcon` (`bell` / `inbox` / `check-check`).
