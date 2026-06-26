/* ────────────────────────────────────────────────────────────────────────
   components/ChartEmpty/ChartEmpty.jsx — OmadaChartEmpty

   The Omada "图表空状态" (chart empty state) PATTERN — NOT an illustration.
   Per the Figma spec (node 13644:14162): a chart with no data shows ONLY its
   own frame — axes, gridlines and a ghost plot — with the whole frame dimmed
   to ~40% opacity, and a short caption centred over it. There is deliberately
   no spot illustration here; the faded chart skeleton IS the empty state.

   This keeps the empty/loading state visually continuous with the populated
   chart (same axes, same footprint) instead of swapping in unrelated art.

   Convenience props (all optional):
     • type     — 'line' | 'bar' | 'pie'  (which ghost frame to draw). Default 'line'.
     • title    — chart card title (top-left). Omit for a frame-only card.
     • caption  — centred headline. Default t('chart.empty.title').
     • hint     — centred sub-text. Default t('chart.empty.hint').
     • loading  — show the loading caption + a gentle pulse instead of "no data".
     • height   — frame height in px. Default 240.
     • opacity  — frame dim level. Default 0.4 (the spec value).
     • showCaption — set false for a bare 40% frame (e.g. behind a Spin).

   Visuals are token-driven via CSS vars in omada-overrides.css (line / grid /
   ghost / caption), each with a [data-omada-theme="dark"] twin. No brand hex.

   Figma: Empty-Space 图表空状态 node 13644:14162 (page 43:34767).
   Exports: window.Omada.ChartEmpty
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const W = 560, PAD_L = 36, PAD_R = 16, PAD_T = 16, PAD_B = 28;

  function GhostLine(h) {
    const top = PAD_T, bottom = h - PAD_B, left = PAD_L, right = W - PAD_R;
    const rows = 4;
    const grid = [];
    for (let i = 0; i <= rows; i++) {
      const y = top + (bottom - top) * (i / rows);
      grid.push(<line key={'g' + i} x1={left} y1={y} x2={right} y2={y}
        stroke="var(--om-chart-empty-grid)" strokeDasharray="3 4" />);
    }
    // ghost series — a calm wave, plus a faint area fill
    const pts = [0.62, 0.5, 0.58, 0.4, 0.46, 0.3, 0.36, 0.24];
    const n = pts.length;
    const coords = pts.map((p, i) => {
      const x = left + (right - left) * (i / (n - 1));
      const y = top + (bottom - top) * p;
      return [x, y];
    });
    const linePath = coords.map((c, i) => (i ? 'L' : 'M') + c[0] + ' ' + c[1]).join(' ');
    const areaPath = linePath + ` L${right} ${bottom} L${left} ${bottom} Z`;
    return (
      <g>
        {grid}
        <line x1={left} y1={top} x2={left} y2={bottom} stroke="var(--om-chart-empty-line)" />
        <line x1={left} y1={bottom} x2={right} y2={bottom} stroke="var(--om-chart-empty-line)" />
        <path d={areaPath} fill="var(--om-chart-empty-ghost)" stroke="none" opacity="0.5" />
        <path d={linePath} fill="none" stroke="var(--om-chart-empty-ghost)" strokeWidth="2" />
      </g>
    );
  }

  function GhostBar(h) {
    const top = PAD_T, bottom = h - PAD_B, left = PAD_L, right = W - PAD_R;
    const rows = 4;
    const grid = [];
    for (let i = 0; i <= rows; i++) {
      const y = top + (bottom - top) * (i / rows);
      grid.push(<line key={'g' + i} x1={left} y1={y} x2={right} y2={y}
        stroke="var(--om-chart-empty-grid)" strokeDasharray="3 4" />);
    }
    const heights = [0.4, 0.62, 0.34, 0.5, 0.72, 0.46, 0.58];
    const slot = (right - left) / heights.length;
    const bw = slot * 0.5;
    const bars = heights.map((p, i) => {
      const x = left + slot * i + (slot - bw) / 2;
      const bh = (bottom - top) * p;
      return <rect key={'b' + i} x={x} y={bottom - bh} width={bw} height={bh} rx="2"
        fill="var(--om-chart-empty-ghost)" stroke="none" />;
    });
    return (
      <g>
        {grid}
        <line x1={left} y1={top} x2={left} y2={bottom} stroke="var(--om-chart-empty-line)" />
        <line x1={left} y1={bottom} x2={right} y2={bottom} stroke="var(--om-chart-empty-line)" />
        {bars}
      </g>
    );
  }

  function GhostPie(h) {
    const cx = PAD_L + (W - PAD_L - PAD_R) * 0.34;
    const cy = PAD_T + (h - PAD_T - PAD_B) / 2;
    const r = Math.min((h - PAD_T - PAD_B) / 2 - 6, 78);
    const inner = r * 0.58;
    const legendX = cx + r + 36;
    const legend = [0, 1, 2].map((i) => (
      <g key={'l' + i}>
        <rect x={legendX} y={cy - 26 + i * 22} width={12} height={12} rx="2"
          fill="var(--om-chart-empty-ghost)" stroke="none" />
        <rect x={legendX + 20} y={cy - 23 + i * 22} width={88 - i * 18} height={6} rx="3"
          fill="var(--om-chart-empty-grid)" stroke="none" />
      </g>
    ));
    return (
      <g>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--om-chart-empty-grid)" strokeWidth="2" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--om-chart-empty-ghost)" strokeWidth="2"
          strokeDasharray={`${2 * Math.PI * r * 0.28} ${2 * Math.PI * r}`} strokeLinecap="butt"
          transform={`rotate(-90 ${cx} ${cy})`} />
        <circle cx={cx} cy={cy} r={inner} fill="var(--om-chart-empty-surface)"
          stroke="var(--om-chart-empty-line)" />
        {legend}
      </g>
    );
  }

  function OmadaChartEmpty(props) {
    const type = props.type || 'line';
    const height = props.height || 240;
    const opacity = props.opacity != null ? props.opacity : 0.4;
    const loading = !!props.loading;
    const showCaption = props.showCaption !== false;
    const title = props.title;
    const className = props.className || '';

    const rest = Object.assign({}, props);
    delete rest.type; delete rest.height; delete rest.opacity; delete rest.loading;
    delete rest.showCaption; delete rest.title; delete rest.caption; delete rest.hint;
    delete rest.className;

    const ctx = window.useOmada ? window.useOmada() : { t: (k) => k };
    const t = ctx.t;
    const caption = props.caption != null ? props.caption
      : (loading ? t('chart.empty.loading') : t('chart.empty.title'));
    const hint = props.hint != null ? props.hint : (loading ? null : t('chart.empty.hint'));

    const frame = type === 'bar' ? GhostBar(height)
      : type === 'pie' ? GhostPie(height)
      : GhostLine(height);

    const cls = ['omada-chart-empty', loading ? 'is-loading' : '', className].filter(Boolean).join(' ');
    const par = type === 'pie' ? 'xMidYMid meet' : 'none';

    return (
      <div className={cls} {...rest}>
        {title && <div className="omada-chart-empty-title">{title}</div>}
        <div className="omada-chart-empty-stage" style={{ height }}>
          <svg className="omada-chart-empty-frame" viewBox={`0 0 ${W} ${height}`}
            preserveAspectRatio={par} style={{ opacity }} aria-hidden="true">
            {frame}
          </svg>
          {showCaption && (
            <div className="omada-chart-empty-cap">
              <div className="omada-chart-empty-head">{caption}</div>
              {hint && <div className="omada-chart-empty-hint">{hint}</div>}
            </div>
          )}
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.ChartEmpty = OmadaChartEmpty;
})();
