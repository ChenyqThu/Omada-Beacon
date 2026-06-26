# Responsive — `Omada.Responsive`

A **responsive / breakpoint board** built on antd's 24-column Grid and the
standard breakpoint scale. Three live surfaces.

## What it shows

| Surface | Source | Notes |
|---|---|---|
| **Active breakpoint** | `Grid.useBreakpoint()` | A chip row — every breakpoint currently satisfied by the **preview width** lights up; the largest active one is tagged. Resize the pane and watch them flip. |
| **Breakpoint scale** | antd breakpoints | `xs < 576` · `sm ≥ 576` · `md ≥ 768` · `lg ≥ 992` · `xl ≥ 1200` · `xxl ≥ 1600`, each with a device label. Active rows are highlighted. |
| **Responsive grid** | `<Row>` / `<Col>` span props | Four cells at `xs 24 · sm 12 · md 8 · lg 6`, plus a content/sidebar split that stacks under `md` — the real reflow, not a screenshot. |

> The hook reflects the **viewport / preview width**, not a container query —
> antd's Grid is viewport-driven.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `className` | `string` | — | Extra class on the root. |

## Theming

Chips, scale rows, grid cells and panels use theme CSS vars in
`omada-overrides.css` (`.omada-resp*`) with `[data-omada-theme="dark"]` twins.
The active accent is the brand green token — no hard-coded hex in the JSX.

## How to use the system

Drive layout with `Col` `span` props per breakpoint (`xs` / `sm` / `md` / `lg` /
`xl` / `xxl`) and the `useBreakpoint` hook for conditional rendering — never
fixed pixel widths.

## i18n

`resp.current` · `resp.scale` · `resp.grid` · `resp.desc` · `resp.active` ·
`resp.xs`…`resp.xxl` · `resp.colNote` · `resp.sidebarNote` · `resp.main` /
`resp.side` · `resp.note` — all via `window.t()`.

**Figma:** no dedicated breakpoint frame; this is antd's Grid responsive system
themed with the Omada tokens.
