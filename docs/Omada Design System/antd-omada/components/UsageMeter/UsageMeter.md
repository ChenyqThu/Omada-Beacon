# UsageMeter — `window.Omada.UsageMeter`

A cluster of quota / usage meters with **threshold tones** — "storage 182 / 250 GB", "licenses 48 / 50". Quota-aware: each meter colours itself ok → warning → critical → over as it fills, reads out used / total in real units, and lays several out as a comparable cluster. Distinct from **Progress** (Batch 7 — a neutral task bar) and **Gauge** (Batch 6 — a single dial).

## Props (cluster)

| Prop | Type | Default | Notes |
|---|---|---|---|
| `meters` | `Meter[]` | `[]` | The meters to render. |
| `variant` | `'bar' \| 'ring'` | `'bar'` | Horizontal bar or compact conic ring. |
| `columns` | number | — | Grid columns; omit for auto-fit. |
| `thresholds` | `{ warning, critical }` | `{ .75, .90 }` | Cluster default; per-meter overrides. |

### Meter

```js
{ key, label, used, total, unit?, icon?, note?,
  format?(v),            // custom readout formatter
  thresholds?,           // per-meter override
  tone?,                 // force a tone
  segments?: [{ label, value, color? }] }  // stacked breakdown on the accent ramp
}
```

## Behaviour
- **Tone** = `used/total` vs thresholds. At ≥ 100% it flips to **over quota** (capped fill, critical tone, "over by X" note).
- **`segments`** replaces the single fill with a stacked breakdown (Omada accent ramp) plus a legend; the tone still reflects total used.
- **`ring`** variant draws a CSS conic dial with a centred percent — no hand-drawn SVG.

## Usage

```jsx
<Omada.UsageMeter
  columns={2}
  meters={[
    { key: 'storage', label: 'Storage', icon: 'cloud', used: 182, total: 250, unit: ' GB' },
    { key: 'lic', label: 'Licenses', used: 48, total: 50, format: (v) => v + ' devices' },
  ]}
/>
```

## Notes
- Dark twin, i18n, RTL-mirrored (bar fills and ring metadata flip via logical properties).
- Tones use the semantic token colours; segments use the chart accent ramp.

## Figma
No dedicated node — usage cells derive from the dashboard / Statistic language. The threshold-toned quota cluster is original to the Omada library.
