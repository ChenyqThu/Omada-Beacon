/* ────────────────────────────────────────────────────────────────────────
   components/DataTable/DataTable.jsx — OmadaDataTable

   Thin wrapper over antd Table — the workhorse data grid (device lists, client
   lists, logs). It stays a presentational wrapper: sorting, selection, fixed
   columns, expandable rows etc. are all native antd props passed straight
   through. Omada adds a few ergonomic defaults + one convenience prop:

   - `dense`      → maps to antd size="small" (the compact device-list density)
   - `rowKey`     → defaults to "key" (override for real id fields)
   - bordered off, sticky header friendly, `scroll` forwarded
   - empty + loading are antd-native: pass `loading` and rely on ConfigProvider
     locale for the "No data" string (do not re-translate it).

   All visuals (header bg/weight, row hover, selected-row green, padding, radius)
   live in omada-theme.js → components.Table + a couple of header rules in
   omada-overrides.css. Nothing colour-bearing is hard-coded here.

   Figma: Table 表格 node group under /Table (Table-Action, Hover, dense rows).

   Exports: window.Omada.DataTable
   ──────────────────────────────────────────────────────────────────────── */

const { Table: AntTable } = window.antd;

function OmadaDataTable({ dense, size, rowKey = 'key', className, ...rest }) {
  delete rest.dense;
  const resolvedSize = size || (dense ? 'small' : 'middle');
  const cls = ['omada-datatable', className].filter(Boolean).join(' ');
  return (
    <AntTable
      size={resolvedSize}
      rowKey={rowKey}
      className={cls}
      {...rest}
    />
  );
}

/* Re-expose statics so callers can use Table.SELECTION_ALL etc. unchanged. */
OmadaDataTable.SELECTION_ALL = AntTable.SELECTION_ALL;
OmadaDataTable.SELECTION_INVERT = AntTable.SELECTION_INVERT;
OmadaDataTable.SELECTION_NONE = AntTable.SELECTION_NONE;
OmadaDataTable.EXPAND_COLUMN = AntTable.EXPAND_COLUMN;
OmadaDataTable.Column = AntTable.Column;
OmadaDataTable.ColumnGroup = AntTable.ColumnGroup;
OmadaDataTable.Summary = AntTable.Summary;

window.Omada = window.Omada || {};
window.Omada.DataTable = OmadaDataTable;
