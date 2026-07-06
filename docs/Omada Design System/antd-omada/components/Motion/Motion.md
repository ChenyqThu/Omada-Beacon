# Motion — `Omada.Motion`

A **token-driven motion spec board** — the live counterpart to the ColorTokens
and Elevation boards. It reads the authoritative motion tokens straight off
`window.omadaThemeLight.token` and renders them as **replayable animated
specimens**, so the board can never drift from the theme: change a token and
the specimens move at the new speed.

## What it shows

| Surface | Source token | Notes |
|---|---|---|
| **Duration scale** | `motionDurationFast` `120ms` · `motionDurationMid` `180ms` · `motionDurationSlow` `240ms` | A dot travels the track at the real token duration + the shared ease-out; each card names its use-case. |
| **Easing** | `motionEaseOut` `cubic-bezier(0.16, 1, 0.3, 1)` | The curve is drawn from the token with control points marked, plus a box that travels with that easing so you can feel it. |
| **Transitions** | — | The four entrance recipes — `fade` · `slide-up` · `scale-in` · `lift` — all on the slow duration so the curve is legible. |

A **Replay** button (and a one-shot auto-play on mount) re-triggers every
specimen by remounting on a nonce.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `className` | `string` | — | Extra class on the root. |

The board takes no configuration by design — it is a specimen of the tokens,
not a configurable widget.

## Theming & motion

Surfaces, axis, grid, curve and the travelling dot/box all come from theme CSS
vars in `omada-overrides.css` (`.omada-motion*`), each with a
`[data-omada-theme="dark"]` twin. Durations and the easing curve are injected
as the `--om-mo-dur` / `--om-mo-ease` CSS custom properties from the tokens.
**All motion is gated behind `@media (prefers-reduced-motion: reduce)`** — the
specimens settle to their end state with no animation.

## i18n

`motion.replay` · `motion.durations` · `motion.easing` · `motion.recipes` ·
`motion.useFast` / `useMid` / `useSlow` · `motion.easeDesc` ·
`motion.fade` / `slide` / `scale` / `lift` — all via `window.t()`.

**Figma:** no dedicated motion frame exists in the source; the values are the
COMPONENT_SPEC §8 reference (`120 / 180 / 240ms` · ease-out
`cubic-bezier(0.16, 1, 0.3, 1)`), which live in `omada-theme.js → token`.
