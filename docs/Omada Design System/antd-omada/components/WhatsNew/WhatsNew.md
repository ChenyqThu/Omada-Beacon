# WhatsNew

The "what's new" changelog drawer. A sparkle/rocket trigger carries an unread `Badge`; clicking it slides in a right-hand `Drawer` of reverse-chronological release entries, each grouped by category tag (**new · improved · fixed**) with a bulleted change list. "Unread" is every entry newer than the last one the user has seen — persisted to `localStorage` under `omada.whatsnew.lastseen`, so the badge clears across reloads and only re-lights when you publish a newer entry. Opening the drawer marks everything seen.

`OmadaWhatsNew` is the all-in-one (trigger + drawer + unread bookkeeping). `OmadaWhatsNew.Trigger` / `.Panel` are exposed for custom placement (e.g. a menu item that opens a controlled `Panel`).

**Figma:** derived from the 更新日志 / Log card pattern (Card/log) + Drawer 抽屉. Original changelog-drawer composite.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `entries` | `Entry[]` | `[]` | **newest-first**; each `id` must be stable |
| `title` | `ReactNode` | `t('wn.title')` | drawer header |
| `triggerLabel` | `string` | `t('wn.whatsnew')` | trigger button text |
| `onOpen` / `onClose` | `() => void` | — | drawer lifecycle |

**Entry** = `{ id, version, date?, title?, changes: { tag, items[] }[] }` where `tag` is `'new' \| 'improved' \| 'fixed'`.

Helpers: `OmadaWhatsNew.unreadCount(entries)`, `.markSeen(entries)`, `.resetSeen()` (clears the flag — handy for demos / "show me again").

- Light + dark + i18n (en/zh) + RTL verified (drawer flips to the left edge in RTL).
- Badge count reflects true unread; trigger is a standard ≥ 32 px Button.
