# Countdown — `Omada.Countdown`

A thin wrapper over antd's **Statistic timer family** — the antd-6 primitive the
library was still missing. One component, two directions.

## Variants

| `type` | Use | Implementation |
|---|---|---|
| `"down"` | deadline — maintenance window, session expiry, firmware rollout | `Statistic.Timer type="countdown"` when present, else the stable `Statistic.Countdown`. |
| `"up"` | elapsed — uptime, provisioning | `Statistic.Timer type="countup"` when present, else a small interval-driven fallback so count-up works on any antd 6 build. |

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `type` | `'down' \| 'up'` | `'down'` | Direction. |
| `value` | `number` (ms timestamp) | — | **Absolute** target (down) or start (up). Absolute so the figure stays correct across re-renders. |
| `format` | `string` | `'HH:mm:ss'` | dayjs tokens — e.g. `D[d] HH:mm:ss` to show days. |
| `icon` | `string` | — | Leading `OmadaIcon` composed into the title. |
| `onFinish` | `() => void` | — | Fires when a countdown reaches zero. |
| `valueStyle` | `object` | — | Forwarded to the value. |
| …rest | | | Forwarded to the underlying antd timer. |

## Usage

```jsx
const { Countdown } = window.Omada;

// deadline
<Countdown type="down" value={Date.now() + 90*60*1000}
           format="HH:mm:ss" icon="clock" title={t('cd.maintIn')} />

// with days
<Countdown type="down" value={target} format="D[d] HH:mm:ss" />

// elapsed
<Countdown type="up" value={bootedAt} format="D[d] HH:mm:ss" icon="power" />

// finish callback
<Countdown type="down" value={Date.now()+8000} format="mm:ss"
           onFinish={() => setDone(true)} />
```

## Theming

No bespoke colour — value and title read antd's `Statistic` tokens, so dark mode
**and** the Theming hue-swap follow automatically. The demo tiles / KPI cards are
themed via `omada-overrides.css` (`.omada-cd*`) with dark twins.

## i18n

Titles and the demo chrome are keyed under `cd.*` via `window.t()`. The digits
are rendered by the timer itself.

## Rule

Pass an **absolute timestamp**, not a remaining duration — duration drifts on
every re-render. Count-up for elapsed time, count-down for deadlines.

**Figma:** no dedicated node; metrics follow the Statistic type scale
(value = `fontSizeHeading2`, title = `colorTextSecondary`).
