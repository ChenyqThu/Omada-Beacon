# PrintExport — 打印 / 导出

A **print / export board**: how a console panel becomes a clean PDF. Pairs the
`Watermark` wrapper with the print-CSS mechanics that matter when a site report
leaves the screen.

`window.Omada.PrintExport` · demo `window.OmadaDemos.PrintExport`

## What it shows
- A paginated **report sheet** specimen (A4-proportioned) wrapped in
  `Omada.Watermark`, with an on-screen page-break guide so the pagination is
  legible before you print.
- **Save as PDF** really prints: it sets `data-omada-print="report"` on `<html>`,
  and a scoped `@media print` block (in `omada-overrides.css`) hides everything
  except `.omada-prx-sheet`, so the browser dialog yields just the report (Save
  as PDF from there). The attribute is cleared on `afterprint`.
- Three mechanic cards: **keep-together** (`break-inside: avoid`), **repeat
  table headers** (`thead { display: table-header-group }`), and the
  tamper-evident **Watermark** that survives the export.
- A copyable **print-CSS snippet** — the `@media print` rules as a starting point.

## Props
Board component — `className` + standard div props. Mount under
`OmadaThemeProvider` (renders `<App>`) so the CSV-export toast (`useMessage`)
resolves.

## Notes
- Print output forces ink-on-white regardless of the on-screen theme — the print
  block lives in `omada-overrides.css` and is not duplicated for dark.
- `.omada-prx-keep` marks rows/cards that must not split across pages.
- The Watermark reads its faint colour from the active theme; in the printed
  sheet it stays a light mark over white.

## Figma
No dedicated node — a print/export pattern board. The watermark is the
Watermark wrapper (confidentiality-overlay pattern); the report reuses the
Descriptions / Table language.
