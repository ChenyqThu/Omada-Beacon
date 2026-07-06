# CommentThread — `window.Omada.CommentThread` (+ `.Pin`)

An inline **annotation / comment-thread cue** — the "someone left a note on this"
pattern. A numbered pin marker opens a Popover holding the thread: an anchor
header (what it's pinned to + a resolve toggle), the comment list (avatar ·
author · relative time · body), and a reply composer.

## Two surfaces

- **`CommentThread.Pin`** — the small numbered marker you drop on a target (a
  port, a row, a topology node). Shows the comment count, tints by resolved
  state, and opens the panel in a `Popover`.
- **`CommentThread`** — the panel itself (also usable inline inside a Drawer):
  header + comment list + composer.

## Props (panel)

| Prop | Type | Notes |
|---|---|---|
| `title` | node | What the thread is anchored to |
| `comments` | `[{ key, author, tone?, time, body, you?, src? }]` | Controlled list |
| `defaultComments` | array | Uncontrolled seed (component owns state) |
| `resolved` | bool | Start resolved |
| `youName` | string | Name used for posted comments (default localized "You") |
| `onAdd` | `(comment) => void` | Fires on post |
| `onResolve` | `(resolved) => void` | Fires on resolve/reopen |

`Pin` additionally takes `count`, `placement`, `style`, `popoverProps`.

## Behaviour

- Composer posts on the **Comment** button or **⌘/Ctrl+Enter**; empty drafts are
  disabled. Posted comments tint with the brand avatar and a localized "you" tag.
- **Resolve** flips the header to a calm resolved state and greys the pin; reopen
  restores. `@Name` runs in a body render as mention chips.
- The composer is the antd `Input.TextArea` (locale-aware); RTL-safe.

## Tokens / CSS

Pin, mention chip, resolved state, composer and list live in `omada-overrides.css`
under `.omada-ct*` with a `[data-omada-theme="dark"]` twin. No hard-coded brand
hex in the JSX.

Figma: collaboration/annotation pattern — no single node (extends Popover 气泡卡片
`3:25129` + Avatar 头像 `2985:128851`). Original redraw.
