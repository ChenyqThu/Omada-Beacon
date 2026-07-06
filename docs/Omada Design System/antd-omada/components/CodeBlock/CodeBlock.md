# CodeBlock

Read-only config / code viewer for "view raw" surfaces — firmware config dumps, CLI snippets, API payloads, and unified diffs. A header carries an optional filename + language tag and a copy button (flips to "Copied"); the body shows monospace lines with optional gutter line numbers and a wrap toggle. Pass `code` (a string) for plain viewing, or `lines` for a diff with green/red tinted rows, +/− gutter marks, and an added/removed count.

**Figma:** no dedicated node — built on the mono type token + the DiffView (Batch 20) row classification. Original.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `code` | `string` | — | plain mode source |
| `lines` | `{ text, type:'add'\|'del'\|'ctx' }[]` | — | diff mode (overrides `code`) |
| `filename` | `string` | — | header label (gets a file glyph) |
| `lang` | `string` | `'text'` | shown when no filename |
| `showLineNumbers` | `bool` | `true` | gutter numbers (plain mode) |
| `copyable` | `bool` | `true` | copy button |
| `wrappable` | `bool` | `false` | show the wrap toggle |
| `defaultWrap` | `bool` | `false` | initial wrap state |

- Light + dark + i18n (en/zh) + RTL verified. No syntax-highlight engine by design — tone comes only from diff classification.
