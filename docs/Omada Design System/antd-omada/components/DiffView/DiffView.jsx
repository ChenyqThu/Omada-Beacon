/* ────────────────────────────────────────────────────────────────────────
   components/DiffView/DiffView.jsx — OmadaDiffView

   A before ↔ after COMPARE view. The surface a controller shows on "review
   changes before apply" / config-history rollback: a field-by-field diff with a
   summary of how many values were added, removed or changed, a split (two
   column) ↔ unified toggle, and a "changes only" filter.

   Behaviour:
     · Each item is classified from its before/after: added (no before),
       removed (no after), changed (both differ), or unchanged. The summary bar
       counts the three change kinds and the toggle hides unchanged rows.
     · SPLIT mode shows before | after side by side, the old side tinted error,
       the new side tinted success; changed rows highlight both. UNIFIED mode
       stacks a "− old" / "+ added" pair per row in one column (the patch view).
     · Items may carry a `group`; rows render under sticky group headers with a
       per-group change count. RTL-safe (split columns mirror).

   Pure presentational composition over antd Segmented + Omada Icon / Tag. All
   chrome is theme-var driven with dark twins in omada-overrides.css; the add =
   green / remove = red / change = amber tints come from the semantic ramp.

   Figma: the config-review / change-confirm language (page 43:34741 review
   panel). Glyphs are OmadaIcon (plus / minus / compare / edit). No branded art.
   Exports: window.Omada.DiffView
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useMemo } = React;
  const { Segmented } = window.antd;
  const Icon = window.Omada.Icon;
  const Switch = window.Omada.Switch;

  function classify(it) {
    const hasB = it.before !== undefined && it.before !== null && it.before !== '';
    const hasA = it.after !== undefined && it.after !== null && it.after !== '';
    if (hasB && !hasA) return 'removed';
    if (!hasB && hasA) return 'added';
    if (JSON.stringify(it.before) !== JSON.stringify(it.after)) return 'changed';
    return 'unchanged';
  }
  function fmt(v) {
    if (v === undefined || v === null || v === '') return null;
    if (typeof v === 'boolean') return v ? 'on' : 'off';
    return String(v);
  }

  function OmadaDiffView(props) {
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className; delete rest.items; delete rest.defaultMode; delete rest.title;
    delete rest.beforeLabel; delete rest.afterLabel;

    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const items = props.items || [];
    const [mode, setMode] = useState(props.defaultMode || 'split');
    const [changesOnly, setChangesOnly] = useState(true);

    const rows = useMemo(() => items.map((it) => Object.assign({}, it, { status: classify(it) })), [items]);
    const counts = useMemo(() => {
      const c = { added: 0, removed: 0, changed: 0 };
      rows.forEach((r) => { if (c[r.status] !== undefined) c[r.status] += 1; });
      return c;
    }, [rows]);
    const totalChanges = counts.added + counts.removed + counts.changed;

    const visible = changesOnly ? rows.filter((r) => r.status !== 'unchanged') : rows;

    // group rows preserving order
    const groups = useMemo(() => {
      const order = [];
      const map = {};
      visible.forEach((r) => {
        const g = r.group || '__';
        if (!map[g]) { map[g] = []; order.push(g); }
        map[g].push(r);
      });
      return order.map((g) => ({ name: g, rows: map[g] }));
    }, [visible]);

    const statusIcon = { added: 'plus', removed: 'minus', changed: 'edit', unchanged: 'check' };

    const renderValue = (v, kind) => {
      const s = fmt(v);
      if (s === null) return <span className="omada-diff-none">—</span>;
      return <span className={'omada-diff-v is-' + kind}>{s}</span>;
    };

    return (
      <div className={('omada-diff omada-diff-' + mode + ' ' + className).trim()} {...rest}>
        <div className="omada-diff-head">
          <div className="omada-diff-summary">
            {totalChanges === 0
              ? <span className="omada-diff-nochanges"><Icon name="check-circle" size={15} />{t('diff.noChanges')}</span>
              : (
                <React.Fragment>
                  <span className="omada-diff-stat is-added"><Icon name="plus" size={13} />{counts.added} {t('diff.added')}</span>
                  <span className="omada-diff-stat is-removed"><Icon name="minus" size={13} />{counts.removed} {t('diff.removed')}</span>
                  <span className="omada-diff-stat is-changed"><Icon name="edit" size={13} />{counts.changed} {t('diff.changed')}</span>
                </React.Fragment>
              )}
          </div>
          <div className="omada-diff-controls">
            <Switch size="small" checked={changesOnly} onChange={setChangesOnly} />
            <span className="omada-diff-toggletext">{t('diff.changesOnly')}</span>
            <Segmented
              size="small"
              value={mode}
              onChange={setMode}
              options={[
                { label: <span className="omada-diff-segopt"><Icon name="compare" size={14} />{t('diff.split')}</span>, value: 'split' },
                { label: <span className="omada-diff-segopt"><Icon name="list" size={14} />{t('diff.unified')}</span>, value: 'unified' },
              ]}
            />
          </div>
        </div>

        {mode === 'split' && (
          <div className="omada-diff-collabels">
            <span className="omada-diff-collabel is-before">{props.beforeLabel || t('diff.before')}</span>
            <span className="omada-diff-collabel is-after">{props.afterLabel || t('diff.after')}</span>
          </div>
        )}

        <div className="omada-diff-body">
          {visible.length === 0 && (
            <div className="omada-diff-empty">{t('diff.allSame')}</div>
          )}
          {groups.map((g) => (
            <div className="omada-diff-group" key={g.name}>
              {g.name !== '__' && (
                <div className="omada-diff-grouphd">
                  <span>{g.name}</span>
                  <span className="omada-diff-groupcount">{g.rows.filter((r) => r.status !== 'unchanged').length}</span>
                </div>
              )}
              {g.rows.map((r) => (
                <div className={'omada-diff-row is-' + r.status} key={r.key}>
                  <span className="omada-diff-marker" aria-hidden="true"><Icon name={statusIcon[r.status]} size={13} /></span>
                  <span className="omada-diff-label">{r.label}</span>
                  {mode === 'split' ? (
                    <span className="omada-diff-pair">
                      <span className="omada-diff-cell is-before">
                        {r.status === 'added' ? <span className="omada-diff-none">—</span> : renderValue(r.before, r.status === 'changed' || r.status === 'removed' ? 'old' : 'same')}
                      </span>
                      <span className="omada-diff-arrow" aria-hidden="true"><Icon name="arrow-right" size={14} /></span>
                      <span className="omada-diff-cell is-after">
                        {r.status === 'removed' ? <span className="omada-diff-none">—</span> : renderValue(r.after, r.status === 'changed' || r.status === 'added' ? 'new' : 'same')}
                      </span>
                    </span>
                  ) : (
                    <span className="omada-diff-unified">
                      {(r.status === 'removed' || r.status === 'changed') && (
                        <span className="omada-diff-line is-old"><span className="omada-diff-sign">−</span>{renderValue(r.before, 'old')}</span>
                      )}
                      {(r.status === 'added' || r.status === 'changed') && (
                        <span className="omada-diff-line is-new"><span className="omada-diff-sign">+</span>{renderValue(r.after, 'new')}</span>
                      )}
                      {r.status === 'unchanged' && (
                        <span className="omada-diff-line is-same"><span className="omada-diff-sign">&nbsp;</span>{renderValue(r.after, 'same')}</span>
                      )}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.DiffView = OmadaDiffView;
})();
