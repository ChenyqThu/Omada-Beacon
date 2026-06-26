# Coachmarks — `window.Omada.Coachmarks`

A feature-spotlight **coachmark sequence** — the lighter, self-hosting cousin of
`Tour`. Each step points at a target element; the component dims the rest of a
container, cuts a spotlight around the target, drops a pulsing beacon, and floats
a callout card (icon · title · body · step dots · Back / Next / Done + Skip).

## Props

| Prop | Type | Notes |
|---|---|---|
| `steps` | `[{ target, title, body, icon?, placement? }]` | `target` is a CSS selector / id resolved **within the container**; `placement` ∈ top/bottom/left/right (auto-clamps inside) |
| `open` / `defaultOpen` | bool | Controlled / uncontrolled visibility |
| `current` / `defaultCurrent` | number | Controlled / uncontrolled step index |
| `onChange` | `(index) => void` | Step change |
| `onClose` | `() => void` | Skip / Done / Esc |
| `getContainer` | `() => Element` | Scope to an external container; default = the component's own relative wrapper around `children` |
| `children` | node | The surface the coachmarks point at |

## Behaviour

- Scoped to a container — the spotlight + callout are positioned relative to it
  (not the viewport), so it stays contained inside panels / drawers / cards.
  Recomputes target geometry on step change + resize (ResizeObserver).
- The spotlight uses the **box-shadow-spread mask trick** (one ring element casts
  a huge translucent shadow over everything else) — no extra DOM, no SVG.
- Keyboard: **→ / Enter** next, **←** back, **Esc** closes. `prefers-reduced-
  motion` drops the beacon pulse.

## Tokens / CSS

Scrim, spotlight ring, beacon pulse, callout card and step dots live in
`omada-overrides.css` under `.omada-cm*` with a `[data-omada-theme="dark"]` twin.
Brand-green ring/beacon; no hard-coded brand hex in the JSX.

Figma: onboarding spotlight pattern — extends Tour 漫游引导 (no dedicated node);
original redraw.
