# CommandBar — `window.Omada.CommandBar`

The floating contextual selection toolbar. When a multi-select exists, a pill rises from the bottom-centre of a positioned stage, floats over the content, and tucks away when the selection clears. Distinct from **BulkActions** (Batch 19), which pins a bar *above* a table; CommandBar floats over the content (Linear/Notion style) and is detached from any single table header.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `count` | number | `0` | Selection count shown in the chip. |
| `open` | boolean | `count > 0` | Force visibility. Omit to derive from `count`. |
| `actions` | `Action[]` | `[]` | `{ key, label, icon?, tone?, disabled?, tooltip? }`. `tone:'danger'` renders error-toned. |
| `maxVisible` | number | `3` | Actions beyond this collapse into a ⋮ More dropdown. |
| `placement` | `'bottom' \| 'top'` | `'bottom'` | Which edge it rises from. |
| `fixed` | boolean | `false` | `position:fixed` to the viewport instead of `absolute` to the nearest positioned ancestor. |
| `label` | string | — | Override the "{n} selected" text entirely. |
| `onAction` | `(key) => void` | — | Fired for visible buttons and overflow items. |
| `onClear` | `() => void` | — | Trailing ✕; omit to hide the clear button. |

## Usage

```jsx
<div style={{ position: 'relative' }}>
  {/* …your selectable list / table… */}
  <Omada.CommandBar
    count={selected.length}
    actions={[
      { key: 'reboot', label: 'Reboot', icon: 'reboot' },
      { key: 'move',   label: 'Move to site', icon: 'move-to-site' },
      { key: 'forget', label: 'Forget', icon: 'trash', tone: 'danger' },
    ]}
    onAction={(k) => run(k, selected)}
    onClear={() => setSelected([])}
  />
</div>
```

## Notes
- **Anchored by default.** Wrap the scroll/list area in `position: relative` so the bar floats inside it. Use `fixed` for app-wide selection (e.g. a page-level table).
- **Dark + i18n + RTL.** Surface is the dark elevated token; all chrome strings route through `window.t`; the bar rises and mirrors under RTL via logical properties.
- **Accessibility.** `role="toolbar"`, `aria-hidden` when closed, 44 px-tall actions.

## Figma
No dedicated node — the dark floating surface reuses the Message / Dropdown elevated surface (`3:16099`). The selection-toolbar composition is original to the Omada library.
