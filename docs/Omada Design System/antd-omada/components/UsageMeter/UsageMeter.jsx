/* ────────────────────────────────────────────────────────────────────────
   components/UsageMeter/UsageMeter.jsx — OmadaUsageMeter

   A cluster of quota / usage meters with THRESHOLD tones — "storage 182 / 250
   GB", "licenses 48 / 50", "bandwidth this month". Distinct from Progress
   (Batch 7, a neutral task bar) and Gauge (Batch 6, a single dial): the
   UsageMeter is quota-aware — it colours itself ok → warning → critical → over
   as it fills, reads out used / total in real units, and lays several out as a
   comparable cluster.

     · Tone derives from used/total against `thresholds` (default warn .75 /
       crit .90); at ≥100% it flips to an "over quota" state with an over-by note.
     · `segments` turn a meter into a stacked breakdown (used by type) on the
       accent ramp instead of a single fill.
     · `variant: 'bar'` (default) or `'ring'` (conic dial, compact).
     · `format(v)` or `unit` controls the readout.

   Thin composition over OmadaIcon on antd-tokened surfaces; bar/ring are pure
   CSS (no hand SVG). Token-driven, dark twin, i18n, RTL-mirrored.

   Figma: no dedicated node — usage cells from the dashboard/Statistic language;
   the threshold-toned quota cluster is original.
   Exports: window.Omada.UsageMeter (+ .Item)
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const Icon = window.Omada.Icon;
  const RAMP = ['#00A870', '#7BC62D', '#2A6FDB', '#C84BD6', '#E89C1C', '#EE385C'];

  function toneOf(pct, th) {
    const warn = th && th.warning != null ? th.warning : 0.75;
    const crit = th && th.critical != null ? th.critical : 0.9;
    if (pct >= 1) return 'over';
    if (pct >= crit) return 'critical';
    if (pct >= warn) return 'warning';
    return 'ok';
  }

  function fmt(v, m) {
    if (m.format) return m.format(v);
    const n = (typeof v === 'number') ? (Math.round(v * 100) / 100) : v;
    return n + (m.unit ? m.unit : '');
  }

  function MeterItem(props) {
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;
    const m = props.meter;
    const variant = props.variant || 'bar';

    const total = m.total || 0;
    const used = m.segments
      ? m.segments.reduce((s, x) => s + (x.value || 0), 0)
      : (m.used || 0);
    const pct = total > 0 ? used / total : 0;
    const clamped = Math.max(0, Math.min(1, pct));
    const tone = m.tone || toneOf(pct, m.thresholds || props.thresholds);
    const pctText = Math.round(pct * 100) + '%';
    const over = pct > 1;

    const readout = (
      <span className="omada-meter-readout">
        <span className="omada-meter-used">{fmt(used, m)}</span>
        <span className="omada-meter-sep">/</span>
        <span className="omada-meter-total">{fmt(total, m)}</span>
      </span>
    );

    if (variant === 'ring') {
      const deg = clamped * 360;
      const ringStyle = { ['--om-meter-deg']: deg + 'deg' };
      return (
        <div className={'omada-meter-item is-ring is-' + tone}>
          <div className="omada-meter-ring" style={ringStyle}>
            <div className="omada-meter-ringhole">
              <span className="omada-meter-ringpct">{pctText}</span>
            </div>
          </div>
          <div className="omada-meter-ringmeta">
            <span className="omada-meter-label">
              {m.icon && <Icon name={m.icon} size={15} />}{m.label}
            </span>
            {readout}
          </div>
        </div>
      );
    }

    return (
      <div className={'omada-meter-item is-bar is-' + tone}>
        <div className="omada-meter-row">
          <span className="omada-meter-label">
            {m.icon && <Icon name={m.icon} size={15} />}{m.label}
          </span>
          <span className="omada-meter-vals">
            {readout}
            <span className="omada-meter-pct">{pctText}</span>
          </span>
        </div>
        <div className="omada-meter-track">
          {m.segments
            ? m.segments.map((s, i) => (
                <span key={i} className="omada-meter-seg"
                      title={s.label}
                      style={{ width: (total > 0 ? Math.min(100, (s.value / total) * 100) : 0) + '%',
                               background: s.color || RAMP[i % RAMP.length] }} />
              ))
            : <span className="omada-meter-fill" style={{ width: (clamped * 100) + '%' }} />}
        </div>
        {(over || m.note || m.segments) && (
          <div className="omada-meter-foot">
            {m.segments && (
              <span className="omada-meter-legend">
                {m.segments.map((s, i) => (
                  <span key={i} className="omada-meter-legenditem">
                    <span className="omada-meter-legenddot" style={{ background: s.color || RAMP[i % RAMP.length] }} />
                    {s.label}
                  </span>
                ))}
              </span>
            )}
            {over && (
              <span className="omada-meter-over">
                <Icon name="warning" size={12} />
                {t('meter.over').replace('{x}', fmt(used - total, m))}
              </span>
            )}
            {!over && m.note && <span className="omada-meter-note">{m.note}</span>}
          </div>
        )}
      </div>
    );
  }

  function OmadaUsageMeter(props) {
    const meters = props.meters || [];
    const variant = props.variant || 'bar';
    const cols = props.columns;
    const cls = 'omada-meter is-' + variant + (props.className ? ' ' + props.className : '');
    const style = cols
      ? { gridTemplateColumns: 'repeat(' + cols + ', minmax(0, 1fr))' }
      : undefined;
    return (
      <div className={cls} style={style}>
        {meters.map((m) => (
          <MeterItem key={m.key || m.label} meter={m} variant={variant} thresholds={props.thresholds} />
        ))}
      </div>
    );
  }

  OmadaUsageMeter.Item = MeterItem;

  window.Omada = window.Omada || {};
  window.Omada.UsageMeter = OmadaUsageMeter;
})();
