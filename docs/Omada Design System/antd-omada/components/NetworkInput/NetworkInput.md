# Network Input — `Omada.IpInput` + `Omada.MacInput`

Segmented network-address fields built on a shared `SegmentedInput` base. antd has no MAC/IP control, so this is an **original Omada component** — still fully token-/CSS-driven, never a fork.

**Figma:** IP地址 node `43:34725` (4 octets 0–255, separated by a 2px dot) · MAC 输入框 node `43:34724` (6 hex pairs separated by "-"). Filled grey `#F4F4F4` field, 4px radius, 32px tall; Focus/Click → 1px brand-green border; Error → 1px red border + "invalid format" message; Disabled → 0.6 opacity.

## `IpInput`

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` / `defaultValue` | `string` | — | `"192.168.0.1"`. |
| `onChange` | `(value, { complete, valid, segments }) => void` | — | `value` is the dotted string. |
| `status` | `'error'` | — | Red border. |
| `disabled` | `boolean` | `false` | |
| `width` | `number` | `240` | |

Octets are digits-only, clamped to 0–255.

## `MacInput`

Same API; value is `"AA-BB-CC-DD-EE-FF"` (6 uppercased hex pairs).

## Behaviour (both)

- Auto-advances to the next segment when one fills, or when you type a separator (`.`, `-`, `:`).
- Backspace at an empty segment jumps to the previous; ←/→ cross segment edges.
- Pasting a whole address (with separators) fills every segment.
- `valid` in the `onChange` payload reflects per-segment validation once `complete`.

## Visuals

The filled field, `is-focused` (green border + 3px ring), `is-error` (red border) and `is-disabled` (opacity) states live in `omada-overrides.css` (`.omada-seg-input*`, + dark twins). The separator dot/dash and the bare segment `<input>`s carry no colour of their own — they inherit text colour and the container border.

## Do / Don't

- ✅ Pair with a label + an external error message (see demo) for form rows.
- ✅ Drive validity off the `onChange` payload's `valid` flag.
- ❌ Don't use a plain `Input` with a regex for addresses — the segmented field prevents malformed entry.
