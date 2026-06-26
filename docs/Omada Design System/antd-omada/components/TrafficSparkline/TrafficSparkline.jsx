/* ────────────────────────────────────────────────────────────────────────
   components/TrafficSparkline/TrafficSparkline.jsx — OmadaTrafficSparkline

   An inline MINI-TREND ROW SET for tables — per-link / per-SSID traffic
   rows, each reading label · sparkline · current value · Δ chip, on one
   aligned grid so a column of trends scans like a table column. A
   "shared scale" mode draws every row against the same max so magnitudes
   compare honestly across rows.

   Distinct from Sparkline (Batch 6) — that is ONE ECharts mini line for a
   stat tile. This is the table-row composition: a lightweight inline-SVG
   polyline per row (cheap enough for many rows — no chart instances),
   aligned readouts, automatic Δ tone (rising green / falling red / flat
   neutral), and the shared-scale comparator.

     · `rows: [{ key, label, icon?, data: number[], unit?, format? }]`
     · `sharedScale` (or the built-in toggle via `toolbar`) normalises all
       rows to the global max; per-row scale otherwise.
     · Δ compares the last point to the first; `flatBand` (default 3%)
       counts as flat. Sparkline geometry stays LTR in RTL.

   Stroke/fill colours come from CSS classes (token vars + dark twins in
   omada-overrides.css) — the SVG only carries geometry.

   Figma: node 536:13574 (mini trend glyph) for the line language; the
   aligned row set is original.
   Exports: window.Omada.TrafficSparkline
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useMemo } = React;
  const { Switch } = window.antd;
  const Icon = window.Omada.Icon;

  const W = 120, H = 28, PAD = 2;

  function points(data, max) {
    const n = data.length;
    if (n === 0) return '';
    const lo = 0;
    const span = Math.max(max - lo, 1e-9);
    const dx = n > 1 ? (W - PAD * 2) / (n - 1) : 0;
    return data.map((v, i) => {
      const x = PAD + dx * i;
      const y = H - PAD - ((v - lo) / span) * (H - PAD * 2);
      return x.toFixed(1) + ',' + y.toFixed(1);
    }).join(' ');
  }

  function fmt(row, v) {
    if (row.format) return row.format(v);
    const n = Math.round(v * 10) / 10;
    return n + (row.unit || '');
  }

  function OmadaTrafficSparkline(props) {
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const rows = props.rows || [];
    const flatBand = props.flatBand == null ? 0.03 : props.flatBand;

    const controlled = props.sharedScale !== undefined;
    const [innerShared, setInnerShared] = useState(false);
    const shared = controlled ? props.sharedScale : innerShared;

    const globalMax = useMemo(
      () => rows.reduce((m, r) => Math.max(m, ...(r.data || [0])), 0),
      [rows]
    );

    return (
      <div className={'omada-tspark' + (props.className ? ' ' + props.className : '')}>
        {props.toolbar !== false && (
          <div className="omada-tspark-bar">
            <span className="omada-tspark-sharedlabel">{t('tspark.shared')}</span>
            <Switch
              size="small"
              checked={shared}
              onChange={(v) => { if (props.onSharedScaleChange) props.onSharedScaleChange(v); if (!controlled) setInnerShared(v); }}
            />
          </div>
        )}
        <div className="omada-tspark-rows" role="table">
          {rows.map((r) => {
            const data = r.data || [];
            const cur = data.length ? data[data.length - 1] : 0;
            const first = data.length ? data[0] : 0;
            const delta = first !== 0 ? (cur - first) / Math.abs(first) : (cur > 0 ? 1 : 0);
            const dir = Math.abs(delta) <= flatBand ? 'flat' : delta > 0 ? 'up' : 'down';
            const max = shared ? globalMax : Math.max(...data, 0);
            const pts = points(data, max);
            const lastPt = pts.split(' ').pop() || '';
            const lastXY = lastPt.split(',');
            return (
              <div key={r.key || r.label} className="omada-tspark-row" role="row">
                <span className="omada-tspark-label">
                  {r.icon && <Icon name={r.icon} size={15} />}
                  {r.label}
                </span>
                <span className={'omada-tspark-line is-' + dir} aria-hidden="true">
                  <svg width={W} height={H} viewBox={'0 0 ' + W + ' ' + H}>
                    {data.length > 1 && (
                      <polygon
                        className="omada-tspark-area"
                        points={PAD + ',' + (H - PAD) + ' ' + pts + ' ' + lastXY[0] + ',' + (H - PAD)}
                      />
                    )}
                    <polyline className="omada-tspark-stroke" points={pts} />
                    {lastXY.length === 2 && <circle className="omada-tspark-dot" cx={lastXY[0]} cy={lastXY[1]} r="2.4" />}
                  </svg>
                </span>
                <span className="omada-tspark-val">{fmt(r, cur)}</span>
                <span className={'omada-tspark-delta is-' + dir}>
                  {dir !== 'flat' && <Icon name={dir === 'up' ? 'trending-up' : 'trending-down'} size={12} />}
                  {dir === 'flat' ? '±0%' : (delta > 0 ? '+' : '−') + Math.round(Math.abs(delta) * 100) + '%'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.TrafficSparkline = OmadaTrafficSparkline;
})();
