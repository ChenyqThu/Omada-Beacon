# VirtualList — 虚拟滚动 / 数据密度

A **virtualization board**: how to render a 10,000-row device list without
dropping frames. antd 6 `Table` ships a `virtual` prop (rc-virtual-list) that
windows the rows — only the visible slice plus a small buffer is in the DOM.

`window.Omada.VirtualList` · demo `window.OmadaDemos.VirtualList`

## What it proves
A live counter reads how many `.ant-table-row` nodes actually exist while you
scroll. With `virtual` on, ~15–20 rows stay mounted out of 10,000 (a fraction
of a percent). Flip the switch off and the table mounts the full set — the
count jumps and scroll stutters. **When off the data is capped to 400 rows** so
the demo can never hang the page.

## Rules (guidance cards)
| Card | Rule |
|------|------|
| **When** | virtualize past ~100 rows you can't paginate server-side |
| **Requires** | a fixed `scroll={{ y }}` height **and** fixed column widths |
| **Cost** | loses in-DOM Ctrl+F, complicates uneven-height/expandable rows |

## Props
Board component — `className` + standard div props. The table is the
Omada-themed antd `Table`, so light / dark / RTL come for free.

## Notes
- Rows are seeded deterministically so the list is stable across theme/lang
  toggles.
- `scroll.y` is mandatory for `virtual` — without a bounded height antd can't
  window. `scroll.x` keeps columns from collapsing.
- For truly huge sets prefer server pagination or `List` + `useInfiniteScroll`;
  virtualization is a render optimisation, not a data-fetch strategy.

## Figma
No dedicated node — a performance/architecture board. Row visuals reuse the
DataTable language (node `536:7989`).
