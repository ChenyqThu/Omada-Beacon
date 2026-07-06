# ThemeTransition — `Omada.ThemeTransition`

A light↔dark **theme-switch board** built on the **View Transitions API**. The
plain antd theme swap is instant; this wraps `setMode` in
`document.startViewTransition` so the whole page cross-fades, with an optional
**circular reveal** clipped from the toggle that was clicked.

`window.Omada.ThemeTransition` · demo `window.OmadaDemos.ThemeTransition` ·
helper `window.Omada.viewTransition`

## The reusable helper
```js
window.Omada.viewTransition(applyFn, {
  style: 'reveal' | 'fade' | 'instant',   // default 'reveal'
  origin: element | DOMRect | { x, y },   // centre of the circular reveal
});
```
- `reveal` — `startViewTransition`, then animate a growing `circle()` clip on
  `::view-transition-new(root)` from the origin point (480ms, ease-out token).
- `fade` — `startViewTransition` only; the browser's default cross-fade.
- `instant` — runs `applyFn` synchronously, no transition.

## Graceful degradation
If `document.startViewTransition` is missing **or** the user prefers reduced
motion, `applyFn` runs synchronously — instant swap, no broken state, no
polyfill. The board detects both and disables the non-instant styles, showing a
support line so the behaviour is never a surprise.

## Behaviour
- The big switch and the two side buttons all swap the **live** app theme
  through `useOmada().setMode`, so the transition runs across the real gallery.
- The reveal grows from whichever control was clicked.

## Tokens / styling
Switch track, knob, style chips and the support line are theme-var driven with
`[data-omada-theme="dark"]` twins in `omada-overrides.css`. The reveal duration
uses the §0 motion token. No hard-coded brand hex in the `.jsx`. Strings via
`window.t()` (`tvt.*`). Mirrors under RTL.

## Figma
No dedicated node — an interaction/motion pattern layered on the ThemeProvider
mode state. Glyphs are `OmadaIcon` (`sun` / `moon`).
