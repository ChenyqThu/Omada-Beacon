# Cheatsheet — `window.Omada.Cheatsheet`

A keyboard-shortcut cheatsheet **generated from a registered shortcut map** — the legend builds itself from whatever the app registers, instead of being hand-authored. Distinct from **ShortcutsOverlay** (Batch 19), which renders a static, manually-curated list.

## Parts

- `Omada.Cheatsheet` — the Modal. Reads the live registry (merged with a `shortcuts` prop), groups by `group`, offers a search filter, and binds `?` to open.
- `Omada.Cheatsheet.Trigger` — the "⌨ Shortcuts" opener button.
- `Omada.Cheatsheet.register(items) → unregister()` — imperative registry add.
- `Omada.Cheatsheet.clear(id?)` — remove one / all.
- `useShortcuts(items, { bind })` — register on mount, clean up on unmount; with `bind:true` also wires a real `keydown` handler that matches single-chord combos and calls each entry's `run`.

## Shortcut entry

```js
{ id?, group, keys, label, run? }
```

- `keys` accepts `'mod+k'`, `['mod','K']`, or a sequence `'g s'` (space = "then").
- `mod` renders **⌘ on macOS, Ctrl elsewhere**; `shift/alt/enter/esc/arrows` get glyphs.
- Only single-chord combos are *bound* by `useShortcuts`; sequences are display-only.

## Cheatsheet props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `open` / `onOpenChange` | boolean / fn | — | Controlled open. Omit for self-managed. |
| `shortcuts` | `Entry[]` | — | Extra entries merged with the registry. |
| `openKey` | `false` | — | Pass `false` to disable the `?`-to-open binding. |
| `width` | number | `600` | Modal width. |

## Usage

```jsx
function Page() {
  useShortcuts([
    { group: 'Global', keys: 'mod+k', label: 'Open search', run: openSearch },
    { group: 'Nav', keys: 'g s', label: 'Go to settings' },
  ], { bind: true });
  return <Omada.Cheatsheet.Trigger onClick={() => setOpen(true)} />;
}
```

## Figma
No dedicated node — `<kbd>` chip styling matches the CommandPalette reference (Batch 17, `3:16099` surface family). The registry-generator pattern is original.
