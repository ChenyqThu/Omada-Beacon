/* ────────────────────────────────────────────────────────────────────────
   components/SpeedTest/SpeedTest.jsx — OmadaSpeedTest

   A WAN speed-test result panel with a RUN STATE MACHINE:

     idle → latency → down → up → done

   Three metric cells (latency · download · upload) light up as their
   phase runs — the active cell pulses and its value climbs live toward
   the target. Past results render as a hand-rolled inline-SVG history
   sparkline (download solid, upload dashed) and each completed run is
   appended.

     · `target`  — { latency, jitter, down, up } the simulated run
                    settles on (defaults provided).
     · `history` — [{ down, up }] seed runs for the sparkline.
     · `meta`    — small caption under the title (e.g. gateway · WAN).
     · `onComplete(result)` — observes each finished run.

   The built-in runner is a presentational simulation (no real probe).
   Token-driven, dark twin, i18n, RTL-safe (digits LTR).
   Figma: no dedicated node this session (VFS permission pending) —
   metric anatomy follows Statistic / MetricCards; sparkline follows
   TrafficSparkline (inline SVG, CSS-class colours).
   Exports: window.Omada.SpeedTest
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const Icon = window.Omada.Icon;
  const { Button } = window.antd;

  const PHASES = ['latency', 'down', 'up'];
  const PHASE_MS = { latency: 1100, down: 2100, up: 2100 };

  function ease(p) { return 1 - Math.pow(1 - p, 3); }

  function Spark(props) {
    // points: [{down, up}] → two polylines on a shared scale
    const pts = props.points;
    if (!pts || pts.length < 2) return null;
    const W = 220, H = 44, P = 3;
    const max = Math.max(1, ...pts.map((r) => Math.max(r.down, r.up)));
    const x = (i) => P + (i * (W - 2 * P)) / (pts.length - 1);
    const y = (v) => H - P - (v / max) * (H - 2 * P);
    const line = (k) => pts.map((r, i) => x(i).toFixed(1) + ',' + y(r[k]).toFixed(1)).join(' ');
    return (
      <svg className="omada-spt-spark" width={W} height={H} viewBox={'0 0 ' + W + ' ' + H} aria-hidden="true">
        <polyline className="omada-spt-line-down" points={line('down')} />
        <polyline className="omada-spt-line-up" points={line('up')} />
      </svg>
    );
  }

  function OmadaSpeedTest(props) {
    const { useState, useEffect, useRef } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const target = Object.assign({ latency: 14, jitter: 3, down: 487, up: 312 }, props.target);

    const [phase, setPhase] = useState('idle'); // idle | latency | down | up | done
    const [vals, setVals] = useState({ latency: null, jitter: null, down: null, up: null });
    const [history, setHistory] = useState(() => (props.history || []).slice());
    const raf = useRef(null);

    useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

    const runPhase = (idx, acc) => {
      const ph = PHASES[idx];
      setPhase(ph);
      const t0 = performance.now();
      const dur = PHASE_MS[ph];
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const wobble = p < 1 ? (Math.sin(now / 90) * 0.06 * (1 - p)) : 0;
        const v = target[ph] * (ease(p) + wobble);
        setVals((old) => {
          const next = Object.assign({}, old);
          next[ph] = ph === 'latency' ? Math.max(1, Math.round(target.latency * 2 - v)) : Math.max(0, v);
          if (ph === 'latency') next.jitter = p > 0.5 ? target.jitter : null;
          return next;
        });
        if (p < 1) { raf.current = requestAnimationFrame(step); return; }
        const settled = ph === 'latency' ? target.latency : target[ph];
        setVals((old) => { const n = Object.assign({}, old); n[ph] = settled; return n; });
        const nextAcc = Object.assign({}, acc); nextAcc[ph] = settled;
        if (idx + 1 < PHASES.length) { runPhase(idx + 1, nextAcc); return; }
        setPhase('done');
        const result = { latency: target.latency, jitter: target.jitter, down: target.down, up: target.up };
        setHistory((h) => h.concat([{ down: result.down, up: result.up }]));
        if (props.onComplete) props.onComplete(result);
      };
      raf.current = requestAnimationFrame(step);
    };

    const run = () => {
      if (phase !== 'idle' && phase !== 'done') return;
      setVals({ latency: null, jitter: null, down: null, up: null });
      runPhase(0, {});
    };

    const running = phase !== 'idle' && phase !== 'done';
    const fmt = (v, dec) => (v == null ? '—' : Number(v).toFixed(dec));

    const cells = [
      { k: 'latency', icon: 'clock', label: t('spt.latency'), value: vals.latency == null ? '—' : Math.round(vals.latency), unit: t('spt.ms'),
        sub: vals.jitter == null ? null : t('spt.jitter') + ' ' + vals.jitter + ' ' + t('spt.ms') },
      { k: 'down', icon: 'arrow-down', label: t('spt.down'), value: fmt(vals.down, vals.down != null && vals.down < 100 ? 1 : 0), unit: t('spt.mbps'), sub: null },
      { k: 'up', icon: 'arrow-up', label: t('spt.up'), value: fmt(vals.up, vals.up != null && vals.up < 100 ? 1 : 0), unit: t('spt.mbps'), sub: null },
    ];

    return (
      <div className={'omada-spt' + (props.className ? ' ' + props.className : '')}>
        <div className="omada-spt-head">
          <span className="omada-spt-headicon"><Icon name="gauge" size={18} /></span>
          <div className="omada-spt-headtxt">
            <span className="omada-spt-status">
              {phase === 'idle' && t('spt.idle')}
              {phase === 'latency' && t('spt.phase.latency')}
              {phase === 'down' && t('spt.phase.down')}
              {phase === 'up' && t('spt.phase.up')}
              {phase === 'done' && (t('spt.latency') + ' ' + target.latency + ' ' + t('spt.ms') + ' · ↓ ' + target.down + ' / ↑ ' + target.up + ' ' + t('spt.mbps'))}
            </span>
            {props.meta && <span className="omada-spt-meta">{props.meta}</span>}
          </div>
          <Button type="primary" loading={running} onClick={run}>
            {phase === 'done' ? t('spt.again') : t('spt.run')}
          </Button>
        </div>

        <div className="omada-spt-cells">
          {cells.map((c) => (
            <div key={c.k} className={'omada-spt-cell' + (phase === c.k ? ' is-live' : '') + (c.value !== '—' ? ' has-value' : '')}>
              <span className="omada-spt-celllabel"><Icon name={c.icon} size={13} />{c.label}</span>
              <span className="omada-spt-cellvalue">
                {c.value}<span className="omada-spt-cellunit">{c.unit}</span>
              </span>
              {c.sub && <span className="omada-spt-cellsub">{c.sub}</span>}
              {phase === c.k && <span className="omada-spt-livebar" aria-hidden="true" />}
            </div>
          ))}
        </div>

        {history.length >= 2 && (
          <div className="omada-spt-hist">
            <span className="omada-spt-histlabel">{t('spt.history')}</span>
            <Spark points={history.slice(-14)} />
            <span className="omada-spt-histlegend">
              <span className="omada-spt-leg is-down" /> {t('spt.down')}
              <span className="omada-spt-leg is-up" /> {t('spt.up')}
            </span>
          </div>
        )}
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.SpeedTest = OmadaSpeedTest;
})();
