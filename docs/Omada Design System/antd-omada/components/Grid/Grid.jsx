/* ────────────────────────────────────────────────────────────────────────
   components/Grid/Grid.jsx — OmadaRow + OmadaCol

   Thin wrappers over antd's 24-column <Row>/<Col> grid — the responsive
   skeleton behind the Omada dashboard / settings / device pages (the
   /Layout Figma page is built on this grid). The only Omada opinion is a
   default gutter on the 8-grid: [16, 16] (horizontal, vertical). Everything
   else (span, offset, responsive breakpoints, justify, align, flex) forwards
   straight through to antd.

   Purely structural — no colour, so light + dark are identical.

   Figma: Layout 布局 page node 3:64434 (dashboard / settings / device grids).
   Exports: window.Omada.Row, window.Omada.Col, window.Omada.Grid
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Row: AntRow, Col: AntCol, Grid: AntGrid } = window.antd;

  function OmadaRow({ gutter = [16, 16], className = '', children, ...rest }) {
    const cls = ['omada-row', className].filter(Boolean).join(' ');
    return <AntRow gutter={gutter} className={cls} {...rest}>{children}</AntRow>;
  }

  function OmadaCol({ className = '', children, ...rest }) {
    const cls = ['omada-col', className].filter(Boolean).join(' ');
    return <AntCol className={cls} {...rest}>{children}</AntCol>;
  }

  window.Omada = window.Omada || {};
  window.Omada.Row = OmadaRow;
  window.Omada.Col = OmadaCol;
  // expose antd Grid for useBreakpoint() if a caller needs it
  window.Omada.Grid = AntGrid;
})();
