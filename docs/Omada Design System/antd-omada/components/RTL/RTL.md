# RTL — direction mirroring

RTL is a **capability**, not a component. The whole Omada library mirrors when
`ThemeProvider`'s `dir` state is `'rtl'`: it sets antd `ConfigProvider
direction="rtl"` and `<html dir="rtl">`, and persists to `localStorage`.
Toggle it from the gallery toolbar (LTR / RTL), or read/set it via
`useOmada() → { dir, setDir, toggleDir }`.

## How it works
- antd handles logical-property mirroring (paddings, icon sides, dropdown
  alignment, table columns) once `direction` is set on `ConfigProvider`.
- `<html dir>` lets the page chrome + any custom CSS using logical properties
  flip too.
- No per-component work: every Batch 1–8 wrapper forwards to antd, so they all
  mirror for free. Use logical CSS (`margin-inline-start`, `inset-inline-end`)
  in new overrides rather than hard `left`/`right`.

## Demo
`window.OmadaDemos.RTL` shows an isolated LTR-vs-RTL side-by-side (nested
`ConfigProvider`) plus the live global toggle, so you can compare without
flipping the whole page.

## Do / Don't
- **Do** test new components in RTL before shipping.
- **Don't** position with raw `left`/`right` in CSS — use logical properties so RTL Just Works.

## Figma
- `RTL语言适配规范` — node **17135:1393** (spec page; defers to the shared RTL guideline link).
