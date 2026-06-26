# HintPopover

A thin wrapper over the antd `Popover` that handles the edge cases a plain popover fumbles:

- **Long content** — caps width (`maxWidth`) and scrolls the body (`maxHeight`) instead of ballooning off-screen.
- **Follow-cursor** — the bubble tracks the pointer, for charts / maps / canvases that have no single anchor (`followCursor`).
- **Controlled open** — pass `open` + `onOpenChange` and drive it from your own state (forwarded only when provided, so the default stays uncontrolled).
- **Nested triggers** — a HintPopover inside another's `content` just works; each manages its own open state.
- **Disabled child** — a disabled `Button` swallows mouse events so the trigger never fires; `wrapDisabled` wraps the child in an inline span that still hovers.

**Figma:** derived from the 气泡卡片 / Popover surface + Tooltip 文字提示 symbols (`tooltip/*`, 16 px offset from the page-14 spec). Original edge-case wrapper — the rich Tooltip/Popover board candidate, shipped as a reusable component.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `content` / `title` | `ReactNode` | — | popover body / header (forwarded) |
| `trigger` | `'hover' \| 'click' \| 'focus'` | `'hover'` | forwarded to Popover |
| `placement` | antd placement | `'top'` | forwarded |
| `maxWidth` / `maxHeight` | `number` | `320` / `280` | caps the card; body scrolls past `maxHeight` |
| `followCursor` | `boolean` | `false` | bubble tracks the pointer (own floating layer) |
| `open` / `onOpenChange` | `boolean` / `fn` | — | controlled mode (opt-in) |
| `wrapDisabled` | `boolean` | `false` | wrap a disabled child so it still triggers |
| `getPopupContainer` | `fn` | — | forwarded for scroll-container mounting |

All other antd Popover props pass through. Light + dark + i18n (en/zh) + RTL verified; the follow-cursor bubble offsets to the inline-end so it never sits under the pointer.
