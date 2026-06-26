/* ────────────────────────────────────────────────────────────────────────
   components/DataExplorer/DataExplorer.jsx — OmadaDataExplorer

   A three-pane DATA EXPLORER: a facet rail (left) + a table (center) + a detail
   preview (right). The "browse a fleet" surface — narrow with checkboxes on the
   left, scan the table in the middle, inspect one row on the right.

   Behaviour:
     · `facets`: [{ key, label, options:[{ value, label, count? }] }] → collapsible
       checkbox groups in the rail. Checking filters `rows` (AND across facets,
       OR within a facet) using each row's value at `facet.key`. A header shows
       the active-filter count with a Clear-all.
     · `columns` + `rows`: a themed antd Table (single-select rows). Selecting a
       row opens the preview pane; `renderPreview(row)` supplies its content,
       else a key/value dump of the row. Empty preview shows an Illustration cue.
     · A result count ("N of M") updates live. The preview pane collapses under a
       width breakpoint (the table goes full width); the rail collapses too.
     · RTL-safe; the table is locale-aware (antd ConfigProvider empty/sort text).

   Thin composition over antd Table + Checkbox + OmadaIllustration + Icon + the
   Card surface conventions. All custom chrome theme-var driven with a dark twin.

   Figma: multi-pane browse pattern — composes Table 表格 + the facet rail of
   Tree/Filter language; no single node. Original layout.
   Exports: window.Omada.DataExplorer
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Table, Checkbox, Empty } = window.antd;
  const Icon = window.Omada.Icon;
  const Illustration = window.Omada.Illustration;

  function OmadaDataExplorer(props) {
    const { useState, useMemo } = React;
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className; delete rest.facets; delete rest.columns; delete rest.rows;
    delete rest.rowKey; delete rest.renderPreview; delete rest.previewTitle; delete rest.style;

    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const facets = props.facets || [];
    const columns = props.columns || [];
    const rows = props.rows || [];
    const rowKey = props.rowKey || 'key';

    const [sel, setSel] = useState({});          // { facetKey: [values] }
    const [openFacets, setOpenFacets] = useState(() => facets.map((f) => f.key));
    const [active, setActive] = useState(null);   // selected row key

    const toggleFacetOpen = (k) => setOpenFacets((o) => o.includes(k) ? o.filter((x) => x !== k) : o.concat(k));
    const setFacet = (k, vals) => setSel((s) => Object.assign({}, s, { [k]: vals }));
    const clearAll = () => setSel({});

    const activeCount = Object.values(sel).reduce((n, v) => n + (v ? v.length : 0), 0);

    const filtered = useMemo(() => rows.filter((r) =>
      facets.every((f) => {
        const vals = sel[f.key];
        if (!vals || vals.length === 0) return true;
        return vals.includes(r[f.key]);
      })
    ), [rows, sel, facets]);

    const activeRow = filtered.find((r) => r[rowKey] === active) || null;

    const onRow = (record) => ({
      onClick: () => setActive(record[rowKey]),
    });

    const preview = activeRow
      ? (props.renderPreview
          ? props.renderPreview(activeRow)
          : (
            <dl className="omada-dx-kv">
              {columns.map((c) => (
                <div className="omada-dx-kvrow" key={c.key || c.dataIndex}>
                  <dt>{c.title}</dt>
                  <dd>{c.render ? c.render(activeRow[c.dataIndex], activeRow) : activeRow[c.dataIndex]}</dd>
                </div>
              ))}
            </dl>
          ))
      : null;

    return (
      <div className={('omada-dx ' + className).trim()} style={props.style} {...rest}>
        {/* facet rail */}
        <aside className="omada-dx-rail">
          <div className="omada-dx-railhead">
            <span className="omada-dx-railtitle"><Icon name="filter" size={15} />{t('dx.filters')}</span>
            {activeCount > 0 && (
              <button type="button" className="omada-dx-clear" onClick={clearAll}>{t('dx.clear')} ({activeCount})</button>
            )}
          </div>
          {facets.map((f) => {
            const open = openFacets.includes(f.key);
            return (
              <div className={'omada-dx-facet' + (open ? ' is-open' : '')} key={f.key}>
                <button type="button" className="omada-dx-facethead" onClick={() => toggleFacetOpen(f.key)} aria-expanded={open}>
                  <Icon name="chevron-right" size={14} className="omada-dx-facetcaret" />
                  <span>{f.label}</span>
                </button>
                {open && (
                  <Checkbox.Group
                    className="omada-dx-options"
                    value={sel[f.key] || []}
                    onChange={(vals) => setFacet(f.key, vals)}
                  >
                    {f.options.map((o) => (
                      <label className="omada-dx-opt" key={o.value}>
                        <Checkbox value={o.value} />
                        <span className="omada-dx-optlabel">{o.label}</span>
                        {o.count != null && <span className="omada-dx-optcount">{o.count}</span>}
                      </label>
                    ))}
                  </Checkbox.Group>
                )}
              </div>
            );
          })}
        </aside>

        {/* table */}
        <div className="omada-dx-main">
          <div className="omada-dx-mainhead">
            <span className="omada-dx-result">
              <strong>{filtered.length}</strong> {t('dx.of')} {rows.length} {t('dx.items')}
            </span>
          </div>
          <Table
            className="omada-dx-table"
            size="small"
            columns={columns}
            dataSource={filtered}
            rowKey={rowKey}
            pagination={false}
            scroll={{ y: 320 }}
            onRow={onRow}
            rowClassName={(r) => (r[rowKey] === active ? 'omada-dx-rowactive' : '')}
          />
        </div>

        {/* preview */}
        <aside className={'omada-dx-preview' + (activeRow ? ' is-open' : '')}>
          {activeRow ? (
            <React.Fragment>
              <div className="omada-dx-previewhead">
                <span className="omada-dx-previewtitle">{props.previewTitle ? props.previewTitle(activeRow) : (activeRow[rowKey])}</span>
                <button type="button" className="omada-dx-close" onClick={() => setActive(null)} aria-label={t('common.close')}>
                  <Icon name="close" size={15} />
                </button>
              </div>
              <div className="omada-dx-previewbody">{preview}</div>
            </React.Fragment>
          ) : (
            <div className="omada-dx-previewempty">
              <Illustration name="no-results" size={92} />
              <span>{t('dx.selecthint')}</span>
            </div>
          )}
        </aside>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.DataExplorer = OmadaDataExplorer;
})();
