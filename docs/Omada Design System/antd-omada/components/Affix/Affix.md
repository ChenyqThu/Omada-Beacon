# Affix — `Omada.Affix`

Pins a node to the viewport (or container) edge once it would scroll past. Behavioural antd `<Affix>` wrapper; adds a `lifted` convenience that applies the Omada md shadow + surface + radius while stuck (via `omada-affix-inner.is-stuck`, dark twin included).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `lifted` | `boolean` | `false` | Elevate (shadow + surface) when affixed. |
| `offsetTop` | `number` | — | Forwarded to antd. |
| `target` | `() => HTMLElement` | `window` | Scroll context. |
| `onChange` | `(affixed) => void` | — | Wrapped so `lifted` can track the stuck state, then called through. |

All antd `Affix` props forwarded. **Figma:** sticky-toolbar pattern from `/Layout` (node `3:64434`).
