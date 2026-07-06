# IconBoard — `Omada.IconBoard`

A searchable **specimen board** for the bespoke Omada icon set. It is *not* a
new icon primitive — it reads the live `window.OMADA_ICONS` registry and renders
every glyph as a copy-to-clipboard tile, so the board stays in sync with the set
automatically: add an entry to `OMADA_ICONS` and it appears here.

Each tile renders `OmadaIcon` (never Lucide). Clicking a tile copies the icon
**name** to the clipboard and flashes a "Copied" confirmation. A live name
filter, a glyph-size switch (16 / 20 / 24) and an `{n} icons` tally sit in the
toolbar.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `size` | `16 \| 20 \| 24` | `24` | Initial glyph size; user can switch in the toolbar. |
| `columns` | `number` | responsive | Fixed column count; default auto-fills (min 96px). |
| `filter` | `string` | `''` | Initial search string. |
| `showCount` | `boolean` | `true` | Show the `{n} icons` tally. |
| `onCopy` | `(name) => void` | — | Fired after a tile name is copied. |

## Theming

Border / surface / hover / text all come from theme CSS vars in
`omada-overrides.css` (`.omada-iconboard*`), each with a
`[data-omada-theme="dark"]` twin. No brand hex in the JSX — the search-focus
ring and active size pill pull the brand green from tokens.

## i18n

`iconboard.search` · `iconboard.count` (uses `{n}`) · `iconboard.copied` ·
`iconboard.noMatch` — all via `window.t()`.

**Figma:** Icon-UI 图标规范 node `638:55811`.
