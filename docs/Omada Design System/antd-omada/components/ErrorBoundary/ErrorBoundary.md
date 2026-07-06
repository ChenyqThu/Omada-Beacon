# Error Boundary — `Omada.ErrorBoundary`

The error-handling primitive the library was missing. React only catches
render / lifecycle errors through a **class** `componentDidCatch` boundary —
there is no hook for it — so this is a real class wrapper, and the
antd-recommended composition is *boundary catches → render a `Result`*. This
wires the two and makes recovery a one-click action instead of a white screen.

## Props

| Prop | Type | Notes |
|---|---|---|
| `children` | node | The protected subtree. Re-mounted fresh on reset (key bump). |
| `fallback` | `({ error, reset }) => node` | Custom recovery UI. Omit for the default `Result` screen. |
| `onError` | `(error, info) => void` | Logging / telemetry hook (`componentDidCatch`). |
| `onReset` | `() => void` | Fired on retry — clear the upstream state that caused the crash. |
| `resetKeys` | `any[]` | Change any element to **auto-recover** (e.g. on route change). |

## Default fallback

An `Omada.Result tone="error"` with **Try again** (primary — re-mounts the
subtree), **Reload**, and a collapsible technical detail (dev affordance, hidden
by default). Fully themed light + dark via the Result wrapper's semantic tokens.

## Usage

```jsx
const { ErrorBoundary } = window.Omada;

// default Result recovery screen
<ErrorBoundary onError={logToSentry} onReset={() => setData(null)}>
  <DeviceCard device={device} />
</ErrorBoundary>

// custom inline fallback
<ErrorBoundary fallback={({ reset }) => (
  <InlineError onRetry={reset} />
)}>
  <Widget />
</ErrorBoundary>

// auto-recover on navigation
<ErrorBoundary resetKeys={[route]}>
  <Page />
</ErrorBoundary>
```

## Rule

Wrap **fallible subtrees** (a card, a panel, a route) — not the whole app in one
boundary. A scoped boundary keeps the rest of the screen alive and gives the user
a local retry. Pair `onReset` with the state that caused the crash so retry
actually clears it.

## Theming / i18n

No bespoke colour — the recovery screen is the `Result` wrapper. Chrome in
`.omada-eb*` with dark twins. Strings keyed under `eb.*` via `window.t()`.

**Figma:** no node — an architecture primitive. The recovery screen maps to the
`Result` wrapper (built token-first from the Empty / Illustration style).
