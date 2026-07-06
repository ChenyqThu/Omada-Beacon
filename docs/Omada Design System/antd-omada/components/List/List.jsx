/* ────────────────────────────────────────────────────────────────────────
   components/List/List.jsx — OmadaList

   Thin wrapper over antd <List> for device rosters, activity feeds and grid
   inventories. We don't fork it — we add the `omada-list` class so the
   overrides layer can tune the row hover, meta title weight and header /
   footer chrome (light + dark twins in omada-overrides.css). Everything else
   (dataSource, renderItem, grid, pagination, loadMore, header/footer, size,
   bordered, split, loading) is forwarded straight through.

   List.Item and List.Item.Meta are re-exported so callers compose rows the
   antd way. No brand hex in the JSX — all colour comes from tokens / CSS.

   No dedicated Figma frame (List is an antd primitive the Omada kit renders
   through its table / card vocabulary). Matched against the Table row +
   Card meta specs (Table 43:34741, Card 25331:85805).
   Exports: window.Omada.List
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { List: AntList } = window.antd;

  function OmadaList(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className;
    const cls = ['omada-list', className].filter(Boolean).join(' ');
    return <AntList className={cls} {...rest} />;
  }

  // re-export composition pieces (Item already carries .Meta)
  OmadaList.Item = AntList.Item;

  window.Omada = window.Omada || {};
  window.Omada.List = OmadaList;
})();
