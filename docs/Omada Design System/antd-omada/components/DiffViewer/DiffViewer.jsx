/* ────────────────────────────────────────────────────────────────────────
   components/DiffViewer/DiffViewer.jsx — OmadaDiffViewer

   A line-level TEXT / CONFIG diff — two revisions of a config file, CLI
   dump or JSON rendered as a monospace diff with added / removed line
   highlighting, dual line-number gutters, a +n/−n stat readout and a
   unified ⇄ split (two-pane) toggle. Long unchanged runs collapse into an
   expandable "··· n unchanged lines" row.

   Distinct from DiffView (Batch 20), which compares FIELD values
   before↔after in a form-like layout — this one diffs raw text line by
   line (LCS), like a review pane.

     · `old` / `new` (strings) are diffed internally — no pre-computed
       hunks needed. `mode: 'unified' | 'split'`, `defaultMode` when
       uncontrolled via the built-in toggle (`toolbar={false}` hides it).
     · `context` (default 3) lines kept around changes; the middle of a
       longer unchanged run collapses (`collapse={false}` to disable).
     · Code panes stay LTR in RTL locales (like Inspector / CodeBlock).

   Thin composition over OmadaIcon + Segmented on tokened surfaces.
   Token-driven, dark twin, i18n.

   Figma: no dedicated node — diff colouring derives from the semantic
   success / error tokens; the pane chrome follows CodeBlock (Batch 22).
   Exports: window.Omada.DiffViewer
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useMemo } = React;
  const { Segmented } = window.antd;
  const Icon = window.Omada.Icon;

  /* LCS line diff — fine for config-sized inputs (O(n·m)) */
  function diffLines(aText, bText) {
    const a = String(aText == null ? '' : aText).split('\n');
    const b = String(bText == null ? '' : bText).split('\n');
    const n = a.length, m = b.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
    const ops = [];
    let i = 0, j = 0;
    while (i < n && j < m) {
      if (a[i] === b[j]) { ops.push({ type: 'same', text: a[i], oldNo: i + 1, newNo: j + 1 }); i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) { ops.push({ type: 'del', text: a[i], oldNo: i + 1 }); i++; }
      else { ops.push({ type: 'add', text: b[j], newNo: j + 1 }); j++; }
    }
    while (i < n) { ops.push({ type: 'del', text: a[i], oldNo: i + 1 }); i++; }
    while (j < m) { ops.push({ type: 'add', text: b[j], newNo: j + 1 }); j++; }
    return ops;
  }

  /* Chunk ops into runs, collapsing the middle of long unchanged runs. */
  function chunk(ops, context, collapse, expanded) {
    const runs = [];
    ops.forEach((op) => {
      const last = runs[runs.length - 1];
      const kind = op.type === 'same' ? 'same' : 'change';
      if (last && last.kind === kind) last.ops.push(op);
      else runs.push({ kind, ops: [op] });
    });
    const out = [];
    runs.forEach((run, ri) => {
      if (run.kind === 'change' || !collapse) { out.push(...run.ops.map((o) => ({ row: 'op', op: o }))); return; }
      const head = ri === 0 ? 0 : context;
      const tail = ri === runs.length - 1 ? 0 : context;
      const hidden = run.ops.length - head - tail;
      if (hidden < 4 || expanded.has(ri)) { out.push(...run.ops.map((o) => ({ row: 'op', op: o }))); return; }
      out.push(...run.ops.slice(0, head).map((o) => ({ row: 'op', op: o })));
      out.push({ row: 'collapse', count: hidden, runIndex: ri });
      if (tail > 0) out.push(...run.ops.slice(run.ops.length - tail).map((o) => ({ row: 'op', op: o })));
    });
    return out;
  }

  /* Pair rows for the split view: del-run aligns with the add-run beside it. */
  function pairRows(rows) {
    const out = [];
    let k = 0;
    while (k < rows.length) {
      const r = rows[k];
      if (r.row === 'collapse') { out.push(r); k++; continue; }
      if (r.op.type === 'same') { out.push({ row: 'pair', left: r.op, right: r.op }); k++; continue; }
      const dels = [], adds = [];
      while (k < rows.length && rows[k].row === 'op' && rows[k].op.type !== 'same') {
        if (rows[k].op.type === 'del') dels.push(rows[k].op); else adds.push(rows[k].op);
        k++;
      }
      const len = Math.max(dels.length, adds.length);
      for (let x = 0; x < len; x++) out.push({ row: 'pair', left: dels[x] || null, right: adds[x] || null });
    }
    return out;
  }

  function Gutter(props) {
    return <span className="omada-diffv-no">{props.no == null ? '' : props.no}</span>;
  }

  function OmadaDiffViewer(props) {
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const context = props.context == null ? 3 : props.context;
    const collapse = props.collapse !== false;
    const controlled = props.mode !== undefined;
    const [innerMode, setInnerMode] = useState(props.defaultMode || 'unified');
    const mode = controlled ? props.mode : innerMode;
    const setMode = (v) => { if (props.onModeChange) props.onModeChange(v); if (!controlled) setInnerMode(v); };

    const [expanded, setExpanded] = useState(() => new Set());
    const expand = (ri) => setExpanded((s) => { const n = new Set(s); n.add(ri); return n; });

    const ops = useMemo(() => diffLines(props.old, props.new), [props.old, props.new]);
    const adds = ops.filter((o) => o.type === 'add').length;
    const dels = ops.filter((o) => o.type === 'del').length;
    const rows = useMemo(() => chunk(ops, context, collapse, expanded), [ops, context, collapse, expanded]);
    const pairs = useMemo(() => (mode === 'split' ? pairRows(rows) : null), [rows, mode]);

    const oldLabel = props.oldLabel || t('diffv.old');
    const newLabel = props.newLabel || t('diffv.new');

    const collapseRow = (r, span) => (
      <button key={'c' + r.runIndex + span} type="button" className="omada-diffv-fold" onClick={() => expand(r.runIndex)}>
        <Icon name="chevron-down" size={13} />
        {t('diffv.collapsed').replace('{n}', r.count)}
      </button>
    );

    return (
      <div className={'omada-diffv' + (props.className ? ' ' + props.className : '')}>
        <div className="omada-diffv-bar">
          <span className="omada-diffv-files">
            <Icon name="file-text" size={14} />
            <span className="omada-diffv-fname">{oldLabel}</span>
            <Icon name="arrow-right" size={12} className="omada-diffv-arrow" />
            <span className="omada-diffv-fname">{newLabel}</span>
          </span>
          <span className="omada-diffv-stats">
            <span className="omada-diffv-plus">{t('diffv.added').replace('{n}', adds)}</span>
            <span className="omada-diffv-minus">{t('diffv.removed').replace('{n}', dels)}</span>
          </span>
          {props.toolbar !== false && (
            <Segmented
              size="small"
              value={mode}
              onChange={setMode}
              options={[
                { value: 'unified', label: t('diffv.unified') },
                { value: 'split', label: t('diffv.split') },
              ]}
            />
          )}
        </div>

        {adds === 0 && dels === 0 && <div className="omada-diffv-empty"><Icon name="check-circle" size={14} />{t('diffv.empty')}</div>}

        {mode !== 'split' && (
          <div className="omada-diffv-pane is-unified" role="table">
            {rows.map((r, idx) => r.row === 'collapse' ? collapseRow(r, 'u') : (
              <div key={idx} className={'omada-diffv-line is-' + r.op.type}>
                <Gutter no={r.op.oldNo} /><Gutter no={r.op.newNo} />
                <span className="omada-diffv-sign">{r.op.type === 'add' ? '+' : r.op.type === 'del' ? '−' : ' '}</span>
                <span className="omada-diffv-text">{r.op.text || '\u00A0'}</span>
              </div>
            ))}
          </div>
        )}

        {mode === 'split' && (
          <div className="omada-diffv-pane is-split" role="table">
            {pairs.map((r, idx) => r.row === 'collapse' ? collapseRow(r, 's') : (
              <div key={idx} className="omada-diffv-pairrow">
                <div className={'omada-diffv-line is-half is-' + (r.left ? (r.left === r.right ? 'same' : 'del') : 'blank')}>
                  <Gutter no={r.left ? r.left.oldNo : null} />
                  <span className="omada-diffv-text">{r.left ? (r.left.text || '\u00A0') : ''}</span>
                </div>
                <div className={'omada-diffv-line is-half is-' + (r.right ? (r.right === r.left ? 'same' : 'add') : 'blank')}>
                  <Gutter no={r.right ? r.right.newNo : null} />
                  <span className="omada-diffv-text">{r.right ? (r.right.text || '\u00A0') : ''}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.DiffViewer = OmadaDiffViewer;
})();
