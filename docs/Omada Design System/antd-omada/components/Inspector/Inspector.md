# Inspector — `window.Omada.Inspector`

A read-only JSON / config **tree inspector** — for showing a device config, an API payload, or a theme-token object. Understands JS values and renders them as a collapsible, type-coloured tree. Distinct from **Tree** (Batch 5 — a selectable data-tree control) and **CodeBlock** (Batch 22 — raw monospace text).

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `data` | any | — | The value to inspect (object / array / primitive). |
| `rootKey` | string | — | Label for the root node (e.g. `config`). Omit for none. |
| `rootLabel` | string | `''` | Prefix for copied paths (e.g. `$` → `$.wan.mtu`). |
| `defaultExpandDepth` | number | `1` | Initial open depth. |
| `searchable` | boolean | `true` | Show the path/value filter. |
| `onCopyPath` | `(path) => void` | — | Fired when a row's path is copied. |

## Features
- **Copy path** — click any row (or its ↵ button) to copy a dot/bracket path like `vlans[2].captivePortal.auth`. The headline feature for pointing support at an exact key.
- **Copy value** — the ⧉ button copies the JSON value (pretty-printed for branches).
- **Type colours** — string / number / boolean / null are distinctly toned; branches show a `{…} 4 keys` / `[…] 6 items` summary when collapsed.
- **Search** filters the tree to matching branches and force-expands them; matched keys highlight.
- **Expand-all / collapse-all** in the toolbar.

## Usage

```jsx
<Omada.Inspector
  data={deviceConfig}
  rootKey="config"
  defaultExpandDepth={2}
  onCopyPath={(p) => message.success('Copied ' + p)}
/>
```

## Notes
- Dark twin + i18n on the chrome. The tree body stays LTR even under RTL — paths and values are code.
- Clipboard uses `navigator.clipboard` with a hidden-textarea fallback.

## Figma
No dedicated node — reuses the code/token surface family (CodeBlock, `3:16xxx`). The JSON-tree inspector is original to the Omada library.
