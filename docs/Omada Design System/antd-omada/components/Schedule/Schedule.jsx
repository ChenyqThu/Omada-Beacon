/* ────────────────────────────────────────────────────────────────────────
   components/Schedule/Schedule.jsx — OmadaSchedule

   A weekly time-block selector (7 days × 24 hours) — the classic Omada
   schedule grid used for Wi-Fi / PoE / security time ranges. The Figma
   "Schedule 时间排程" page defers to the security component library, so this
   is an original Omada-styled control: brand-green active cells, grey idle,
   click-or-drag to paint, with Select-all / Clear actions.

   Fully token-/CSS-driven (active = colorPrimary via the Omada green var,
   idle/borders from neutrals) with a light + dark twin in omada-overrides.css.
   Day labels route through window.t (chart.d.*); hour labels are numeric.

   Props: value/defaultValue (boolean[7][24]), onChange(grid), days (labels),
          disabled, className.
   Figma: Schedule 时间排程 node 18482:461 (references security lib).
   Exports: window.Omada.Schedule
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useEffect, useRef, useCallback } = React;

  const make = (rows, cols, fill = false) =>
    Array.from({ length: rows }, () => Array.from({ length: cols }, () => fill));

  function OmadaSchedule({
    value, defaultValue, onChange, days, hours = 24, disabled = false, className = '',
  }) {
    const { t } = window.useOmada();
    const dayKeys = ['chart.d.mon', 'chart.d.tue', 'chart.d.wed', 'chart.d.thu', 'chart.d.fri', 'chart.d.sat', 'chart.d.sun'];
    const dayLabels = days || dayKeys.map((k) => t(k));
    const rows = dayLabels.length;

    const controlled = value != null;
    const [grid, setGrid] = useState(() => (controlled ? value : (defaultValue || make(rows, hours))));
    const paint = useRef(null); // the value we're painting (true/false)
    const dragging = useRef(false);

    useEffect(() => { if (controlled) setGrid(value); }, [value, controlled]);

    const commit = useCallback((next) => {
      if (!controlled) setGrid(next);
      if (onChange) onChange(next);
    }, [controlled, onChange]);

    const apply = (r, c, val) => {
      setGrid((g) => {
        const base = controlled ? value : g;
        const next = base.map((row) => row.slice());
        next[r][c] = val;
        if (onChange) onChange(next);
        return next;
      });
    };

    const startPaint = (r, c) => {
      if (disabled) return;
      dragging.current = true;
      paint.current = !grid[r][c];
      apply(r, c, paint.current);
    };
    const overPaint = (r, c) => {
      if (disabled || !dragging.current) return;
      if (grid[r][c] !== paint.current) apply(r, c, paint.current);
    };

    useEffect(() => {
      const up = () => { dragging.current = false; paint.current = null; };
      window.addEventListener('mouseup', up);
      return () => window.removeEventListener('mouseup', up);
    }, []);

    const setAll = (val) => commit(make(rows, hours, val));

    const cls = ('omada-schedule ' + (disabled ? 'is-disabled ' : '') + className).trim();
    const HourHeader = () => (
      <div className="omada-sched-headrow">
        <div className="omada-sched-corner">{t('sched.day')}</div>
        <div className="omada-sched-hours">
          {Array.from({ length: hours }, (_, h) => (
            <div key={h} className={'omada-sched-hour' + (h % 2 === 0 ? ' is-major' : '')}>
              {h % 2 === 0 ? h : ''}
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div className={cls}>
        <div className="omada-sched-toolbar">
          <span className="omada-sched-title">{t('sched.title')}</span>
          <span className="omada-sched-hint">{t('sched.hint')}</span>
          <div className="omada-sched-actions">
            <window.Omada.Button variant="text" size="small" disabled={disabled} onClick={() => setAll(true)}>
              {t('sched.fill')}
            </window.Omada.Button>
            <window.Omada.Button variant="text" size="small" disabled={disabled} onClick={() => setAll(false)}>
              {t('sched.clear')}
            </window.Omada.Button>
          </div>
        </div>

        <div className="omada-sched-grid" onDragStart={(e) => e.preventDefault()}>
          <HourHeader />
          {grid.map((row, r) => (
            <div className="omada-sched-row" key={r}>
              <div className="omada-sched-day">{dayLabels[r]}</div>
              <div className="omada-sched-cells">
                {row.map((on, c) => (
                  <div
                    key={c}
                    role="checkbox"
                    aria-checked={on}
                    aria-label={`${dayLabels[r]} ${c}:00`}
                    className={'omada-sched-cell' + (on ? ' is-on' : '') + (c % 2 === 0 ? ' is-major' : '')}
                    onMouseDown={() => startPaint(r, c)}
                    onMouseEnter={() => overPaint(r, c)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="omada-sched-legend">
          <span className="omada-sched-leg"><span className="omada-sched-swatch is-on" />{t('sched.active')}</span>
          <span className="omada-sched-leg"><span className="omada-sched-swatch" />{t('sched.inactive')}</span>
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.Schedule = OmadaSchedule;
})();
