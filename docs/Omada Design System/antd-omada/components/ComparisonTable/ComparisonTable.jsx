/* ────────────────────────────────────────────────────────────────────────
   components/ComparisonTable/ComparisonTable.jsx — OmadaComparisonTable

   The side-by-side spec / plan / model comparison table — "which gateway do I
   buy", "what does each license tier include". The attribute column is STICKY
   so labels stay anchored while you scroll many product columns horizontally,
   and the header row is sticky on vertical scroll. Distinct from DiffView
   (Batch 20, a before↔after of one thing) and DataTable (rows of records).

     · `attributes` are the rows (grouped into sections); `columns` are the
       things compared, each carrying a `values` map keyed by attribute.
     · Boolean cells render a green check / muted dash; values can carry a unit;
       a per-attribute render() handles anything bespoke.
     · One column may be `highlight` (accent tint + a "recommended" ribbon).
     · A built-in "differences only" toggle hides rows where every column is
       equal — the fast path to "what actually differs".

   Thin composition over a sticky-positioned <table> + OmadaIcon. Token-driven,
   dark twin, i18n, RTL-mirrored (sticky edge + ribbon flip via logical props).

   Figma: no dedicated node — built from the Table language ("样式对比" 22587:5121
   reference); the sticky-first-column comparison layout is original.
   Exports: window.Omada.ComparisonTable
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Switch } = window.antd;
  const Icon = window.Omada.Icon;

  function cellEqual(a, b) {
    return JSON.stringify(a == null ? null : a) === JSON.stringify(b == null ? null : b);
  }

  function OmadaComparisonTable(props) {
    const { useState, useMemo } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const attributes = props.attributes || [];
    const columns = props.columns || [];
    const showDiffToggle = props.differencesToggle !== false;
    const [diffOnly, setDiffOnly] = useState(!!props.defaultDifferencesOnly);

    // group attributes into sections preserving order
    const sections = useMemo(() => {
      const out = [];
      let cur = null;
      attributes.forEach((a) => {
        const g = a.group || '';
        if (!cur || cur.group !== g) { cur = { group: g, rows: [] }; out.push(cur); }
        cur.rows.push(a);
      });
      return out;
    }, [attributes]);

    const valueOf = (col, attr) => (col.values ? col.values[attr.key] : undefined);

    const isDifferent = (attr) => {
      if (columns.length < 2) return true;
      const first = valueOf(columns[0], attr);
      return columns.some((c) => !cellEqual(valueOf(c, attr), first));
    };

    const renderCell = (col, attr) => {
      const v = valueOf(col, attr);
      if (attr.render) return attr.render(v, col);
      if (attr.type === 'bool' || typeof v === 'boolean') {
        return v
          ? <span className="omada-cmp-yes"><Icon name="check" size={16} /></span>
          : <span className="omada-cmp-no">—</span>;
      }
      if (v == null || v === '') return <span className="omada-cmp-no">—</span>;
      return <span className="omada-cmp-text">{v}{attr.unit ? <span className="omada-cmp-unit">{attr.unit}</span> : null}</span>;
    };

    const cls = 'omada-cmp' + (props.className ? ' ' + props.className : '');
    const recLabel = props.recommendedLabel || t('cmp.recommended');

    return (
      <div className={cls}>
        {(showDiffToggle || props.title) && (
          <div className="omada-cmp-toolbar">
            {props.title && <span className="omada-cmp-title">{props.title}</span>}
            {showDiffToggle && (
              <label className="omada-cmp-difftoggle">
                <Switch size="small" checked={diffOnly} onChange={setDiffOnly} />
                {t('cmp.diffonly')}
              </label>
            )}
          </div>
        )}

        <div className="omada-cmp-scroll">
          <table className="omada-cmp-table">
            <thead>
              <tr>
                <th className="omada-cmp-corner" scope="col">{props.attributeLabel || t('cmp.feature')}</th>
                {columns.map((c) => (
                  <th key={c.key} scope="col"
                      className={'omada-cmp-colhead' + (c.highlight ? ' is-highlight' : '')}>
                    {c.highlight && <span className="omada-cmp-ribbon">{recLabel}</span>}
                    {c.icon && <span className="omada-cmp-colic"><Icon name={c.icon} size={20} /></span>}
                    <span className="omada-cmp-collabel">{c.label}</span>
                    {c.sublabel && <span className="omada-cmp-colsub">{c.sublabel}</span>}
                    {c.price && <span className="omada-cmp-colprice">{c.price}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sections.map((sec, si) => {
                const visibleRows = sec.rows.filter((a) => !diffOnly || isDifferent(a));
                if (visibleRows.length === 0) return null;
                return (
                  <React.Fragment key={si}>
                    {sec.group && (
                      <tr className="omada-cmp-grouprow">
                        <th className="omada-cmp-grouplabel" scope="colgroup" colSpan={columns.length + 1}>
                          {sec.group}
                        </th>
                      </tr>
                    )}
                    {visibleRows.map((attr) => (
                      <tr key={attr.key} className="omada-cmp-row">
                        <th scope="row" className="omada-cmp-rowlabel">
                          <span>{attr.label}</span>
                          {attr.hint && <span className="omada-cmp-rowhint">{attr.hint}</span>}
                        </th>
                        {columns.map((c) => (
                          <td key={c.key} className={'omada-cmp-cell' + (c.highlight ? ' is-highlight' : '')}>
                            {renderCell(c, attr)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
              {diffOnly && sections.every((s) => s.rows.every((a) => !isDifferent(a))) && (
                <tr className="omada-cmp-row">
                  <td className="omada-cmp-allsame" colSpan={columns.length + 1}>{t('cmp.allsame')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.ComparisonTable = OmadaComparisonTable;
})();
