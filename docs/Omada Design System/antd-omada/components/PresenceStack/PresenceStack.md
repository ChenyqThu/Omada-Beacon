# PresenceStack — `window.Omada.PresenceStack`

A collaboration **presence cue**. The "who else is here" avatar stack a shared
surface shows in its top bar — overlapping avatars with a live / idle / offline
dot, a hover name + status, an editing ring on whoever holds the pen, and a "+N"
overflow that opens a roster popover, plus an optional "N viewing" label.

Thin composition over **OmadaAvatar** + Omada **Tooltip / Popover / Icon**. The
active dot and editing ring use the brand-green token; tones cycle the Omada
avatar ramp; dark twins in `omada-overrides.css`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `users` | `User[]` | `[]` | `{ key, name, status, tone?, src?, editing? }`. `status ∈ active · idle · offline`. |
| `max` | `number` | `4` | avatars before the "+N" overflow. |
| `size` | `number` | `30` | avatar diameter (px). |
| `sort` | `boolean` | `true` | sort editing → active → idle → offline. |
| `showLabel` | `boolean` | `true` | trailing label. |
| `label` | `node` | `"{active} viewing"` | override the label text. |

Each avatar has a corner presence dot and a Tooltip (name + localized status).
`editing:true` adds a green ring + "editing" caption. Overflow opens a Popover
roster listing everyone — collapsed, never hidden.

## i18n

Chrome via `window.t()` under `ps.*` incl. `ps.s.<status>` (verified en + zh).
Names passed in.

## Do / Don't

- **Do** cap `max` at 4–5 so the stack stays compact; let "+N" carry the rest.
- **Do** feed `editing` from your realtime lock so the pen-holder is obvious.
- **Don't** invent presence — drive `status` from a real heartbeat / cursor feed.

## Figma

Top-bar avatar language (Avatar 头像 **2985:128851**) extended with a presence
dot — a collaboration pattern with no single node. No branded art.
