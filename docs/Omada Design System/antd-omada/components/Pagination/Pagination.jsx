/* ────────────────────────────────────────────────────────────────────────
   components/Pagination/Pagination.jsx — OmadaPagination

   Thin wrapper over antd Pagination. Omada defaults match the Figma "默认分页":
   - showSizeChanger on by default (the "10 / page" selector)
   - a localized total readout ("Showing 1-10 of 200") via window.t, unless
     the caller passes their own showTotal
   antd's own strings ("/ page", "Go to") come from ConfigProvider locale, so
   pass `lang` only to localize OUR total string. itemSize 32 comes from tokens.

   Figma: Pagination 分页 node 3:16180 (default / simple / mini variants).

   Exports: window.Omada.Pagination
   ──────────────────────────────────────────────────────────────────────── */

const { Pagination: AntPagination } = window.antd;

function OmadaPagination({
  lang,
  showTotal,
  showSizeChanger = true,
  showTotalText = true,
  ...rest
}) {
  delete rest.showTotalText;
  const lg = lang || localStorage.getItem('omada.lang') || 'en';
  const resolvedShowTotal =
    showTotal !== undefined
      ? showTotal
      : (showTotalText
        ? (total, range) =>
            window.t('pagination.total', lg)
              .replace('{from}', range[0])
              .replace('{to}', range[1])
              .replace('{total}', total)
        : undefined);
  return (
    <AntPagination
      showSizeChanger={showSizeChanger}
      showTotal={resolvedShowTotal}
      {...rest}
    />
  );
}

window.Omada = window.Omada || {};
window.Omada.Pagination = OmadaPagination;
