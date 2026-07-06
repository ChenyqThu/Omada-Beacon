# Logo

Real Omada brand marks, extracted from the source Figma as vector SVG.

```jsx
const { Logo } = window.Omada;

<Logo variant="lockup" height={32} />   // "omada by tp-link" wordmark
<Logo variant="appicon" size={64} />    // teal rounded app icon
```

| variant | sizing prop | notes |
|---|---|---|
| `lockup` | `height` (px) | dark ink — on a dark surface apply `filter: brightness(0) invert(1)` for the white version |
| `appicon` | `size` (px, square) | ships with its own teal background + white O-mark |

Files live in `assets/logos/`. The QR and PRO variants were intentionally excluded.
