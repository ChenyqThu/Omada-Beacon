# Topbar — `window.Omada.Topbar`

A responsive application **command bar**: a surface-coloured bar with a leading
slot (title + optional text-nav tabs) and a right-aligned cluster of icon
actions that **collapse into a "more" (⋮) overflow Dropdown** as the bar
narrows. The generic, un-branded sibling of the green `AppShell` header.

Derived from Figma **Top Bar 顶部栏** node `285:6342` and its right-info action
cluster **类型=icon** node `1274:31319` (search · add · refresh · theme ·
account · more, 32px glyphs, gap 8/16, right-aligned). Original un-branded
redraw — no TP/Omada logo chrome (that frame is IP-bound).

## Props

| Prop | Type | Notes |
|---|---|---|
| `title` | node | Leading title text |
| `subtitle` | node | Optional second line under the title |
| `brand` | node | Replace the whole lead slot (title+nav) with custom content |
| `nav` | `[{ key, label, icon? }]` | Text-tab row in the lead slot |
| `activeKey` | string | Active nav tab |
| `onNavChange` | `(key) => void` | Nav tab click |
| `actions` | `[{ key, icon, label, onClick, tone?, badge?, disabled?, divider? }]` | Right action cluster. `tone`: `brand` / `danger`. `badge`: count on the glyph |
| `labels` | bool | Show inline text labels next to each visible action (default false → icon-only + Tooltip) |
| `minVisible` | number | Floor on how many actions stay visible before all-overflow (default 1) |

## Behaviour

- A `ResizeObserver` measures the bar and the lead slot, divides the remaining
  width by a fixed per-action budget, and pushes the remainder into an antd
  `Dropdown` (kebab). One slot is reserved for the overflow trigger so the last
  visible action is never clipped.
- Overflowed actions always show their label + icon inside the menu; `divider`
  items become menu dividers; `tone: 'danger'` rows render danger-styled.
- Icon-only actions get an `OmadaTooltip`; every action is a real `<button>`
  (keyboard + screen-reader reachable, `aria-label` from `label`).
- RTL-safe — lead/actions sides flip via logical properties.

## Tokens / CSS

Bar height, border, hover, the nav active ink and the action hit-target all live
in `omada-overrides.css` under `.omada-topbar*` with a `[data-omada-theme="dark"]`
twin. No hard-coded brand hex in the JSX.

## Do / Don't

- **Do** use for a page-level toolbar / sub-header where the action set varies.
- **Don't** use it to recreate the branded green product header — that's
  `AppShell` (Layout token-driven `headerBg`).
