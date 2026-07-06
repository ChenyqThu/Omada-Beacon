/* ────────────────────────────────────────────────────────────────────────
   components/SchedulePicker/SchedulePicker.jsx — OmadaSchedulePicker

   A week × hour DRAG-PAINT grid for maintenance / access windows — pick a
   state from the palette (Allow / Limit / Block by default), then click or
   drag across the 7 × 24 grid to paint it. One-click PRESETS (always /
   work hours / nights + weekends / clear) and a human-readable SUMMARY
   ("Mon 09:00–18:00 · Allow") generated from the grid.

   Distinct from Schedule (Batch 5-era), which is a BOOLEAN on/off grid —
   the SchedulePicker paints one of SEVERAL states per cell (multi-tone
   heat grid), has an eraser, presets, and writes the summary readout.

     · `states: [{ key, label?, color? }]` — palette; defaults to
       allow / limit / block on the semantic tones.
     · `value` / `defaultValue`: 7×24 array of state key or null;
       `onChange(grid)` on every committed paint.
     · `presets={false}` hides the preset row; `summary={false}` the readout.
     · Hour numbers stay LTR digits in RTL; the grid mirrors naturally.

   Thin composition over OmadaIcon on tokened surfaces; cells are plain
   divs (no SVG). Token-driven, dark twin, i18n.

   Figma: node 31442:27257 ("Schedule 时间排程") defers to the external
   security component library — this control is original to the Omada
   library, multi-state on the semantic tones.
   Exports: window.Omada.SchedulePicker
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { useState, useEffect, useRef, useMemo, useCallback } = React;
  const Icon = window.Omada.Icon;

  const DAYS = 7, HOURS = 24;
  const DAY_KEYS = ['chart.d.mon', 'chart.d.tue', 'chart.d.wed', 'chart.d.thu', 'chart.d.fri', 'chart.d.sat', 'chart.d.sun'];
  const DEFAULT_STATES = [
    { key: 'allow', cls: 'allow' },
    { key: 'limit', cls: 'limit' },
    { key: 'block', cls: 'block' },
  ];

  const makeGrid = () => Array.from({ length: DAYS }, () => Array.from({ length: HOURS }, () => null));

  function buildPreset(name, firstKey) {
    const g = makeGrid();
    for (let d = 0; d < DAYS; d++) {
      for (let h = 0; h < HOURS; h++) {
        if (name === 'always') g[d][h] = firstKey;
        else if (name === 'work' && d < 5 && h >= 9 && h < 18) g[d][h] = firstKey;
        else if (name === 'night' && (d >= 5 || h < 6 || h >= 22)) g[d][h] = firstKey;
      }
    }
    return g;
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  /* "09:00–18:00 · Allow" range list for one day row */
  function dayRanges(row) {
    const out = [];
    let h = 0;
    while (h < HOURS) {
      const v = row[h];
      if (v == null) { h++; continue; }
      let end = h;
      while (end < HOURS && row[end] === v) end++;
      out.push({ from: h, to: end, state: v });
      h = end;
    }
    return out;
  }

  function OmadaSchedulePicker(props) {
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;

    const states = props.states || DEFAULT_STATES;
    const stateLabel = (s) => (s.label != null ? s.label : t('schedp.s.' + s.key));
    const stateOf = (key) => states.find((s) => s.key === key);

    const controlled = props.value != null;
    const [grid, setGrid] = useState(() => (controlled ? props.value : (props.defaultValue || makeGrid())));
    useEffect(() => { if (controlled) setGrid(props.value); }, [props.value, controlled]);

    const [brush, setBrush] = useState(states[0] ? states[0].key : null); // state key or '__erase'
    const painting = useRef(null); // value being painted, or undefined when idle
    const disabled = !!props.disabled;

    const commit = useCallback((next) => {
      if (!controlled) setGrid(next);
      if (props.onChange) props.onChange(next);
    }, [controlled, props.onChange]);

    const paintCell = (d, h, base) => {
      const val = painting.current === '__erase' ? null : painting.current;
      if ((base || grid)[d][h] === val) return base || grid;
      const next = (base || grid).map((row, di) => (di === d ? row.map((c, hi) => (hi === h ? val : c)) : row));
      return next;
    };

    const onDown = (d, h) => (e) => {
      if (disabled) return;
      e.preventDefault();
      // clicking with the active brush on an identical cell erases it (toggle feel)
      const erase = brush !== '__erase' && grid[d][h] === brush;
      painting.current = erase ? '__erase' : brush;
      commit(paintCell(d, h));
    };
    const onEnter = (d, h) => () => {
      if (disabled || painting.current === null || painting.current === undefined) return;
      commit(paintCell(d, h));
    };

    useEffect(() => {
      const up = () => { painting.current = undefined; };
      window.addEventListener('pointerup', up);
      return () => window.removeEventListener('pointerup', up);
    }, []);

    const summary = useMemo(() => {
      const rows = [];
      grid.forEach((row, d) => {
        const ranges = dayRanges(row);
        if (ranges.length) rows.push({ d, ranges });
      });
      return rows;
    }, [grid]);

    const cellTitle = (d, h) => t(DAY_KEYS[d]) + ' ' + pad(h) + ':00–' + pad(h + 1) + ':00';

    return (
      <div className={'omada-schedp' + (disabled ? ' is-disabled' : '') + (props.className ? ' ' + props.className : '')}>
        <div className="omada-schedp-bar">
          <span className="omada-schedp-paintlabel">{t('schedp.paint')}</span>
          <span className="omada-schedp-palette" role="radiogroup" aria-label={t('schedp.paint')}>
            {states.map((s) => (
              <button
                key={s.key}
                type="button"
                role="radio"
                aria-checked={brush === s.key}
                className={'omada-schedp-chip is-' + (s.cls || s.key) + (brush === s.key ? ' is-active' : '')}
                onClick={() => setBrush(s.key)}
                disabled={disabled}
              >
                <span className="omada-schedp-swatch" style={s.color ? { background: s.color } : undefined} />
                {stateLabel(s)}
              </button>
            ))}
            <button
              type="button"
              role="radio"
              aria-checked={brush === '__erase'}
              className={'omada-schedp-chip is-erase' + (brush === '__erase' ? ' is-active' : '')}
              onClick={() => setBrush('__erase')}
              disabled={disabled}
            >
              <span className="omada-schedp-swatch" />
              {t('schedp.erase')}
            </button>
          </span>
          {props.presets !== false && (
            <span className="omada-schedp-presets">
              <span className="omada-schedp-presetlabel">{t('schedp.presets')}</span>
              {['always', 'work', 'night', 'clear'].map((p) => (
                <button key={p} type="button" className="omada-schedp-preset"
                        disabled={disabled}
                        onClick={() => commit(p === 'clear' ? makeGrid() : buildPreset(p, brush === '__erase' ? states[0].key : brush))}>
                  {t('schedp.p.' + p)}
                </button>
              ))}
            </span>
          )}
        </div>

        <div className="omada-schedp-grid" role="grid">
          <div className="omada-schedp-hourrow" aria-hidden="true">
            <span className="omada-schedp-corner" />
            {Array.from({ length: HOURS }, (_, h) => (
              <span key={h} className="omada-schedp-hour">{h % 3 === 0 ? h : ''}</span>
            ))}
          </div>
          {grid.map((row, d) => (
            <div key={d} className="omada-schedp-row" role="row">
              <span className="omada-schedp-daylabel">{t(DAY_KEYS[d])}</span>
              {row.map((cell, h) => {
                const s = cell != null ? stateOf(cell) : null;
                return (
                  <div
                    key={h}
                    role="gridcell"
                    aria-label={cellTitle(d, h) + (s ? ' · ' + stateLabel(s) : '')}
                    title={cellTitle(d, h) + (s ? ' · ' + stateLabel(s) : '')}
                    className={'omada-schedp-cell' + (s ? ' is-on is-' + (s.cls || s.key) : '')}
                    style={s && s.color ? { background: s.color } : undefined}
                    onPointerDown={onDown(d, h)}
                    onPointerEnter={onEnter(d, h)}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {props.summary !== false && (
          <div className="omada-schedp-summary">
            <span className="omada-schedp-summarytitle"><Icon name="clock" size={13} />{t('schedp.summary')}</span>
            {summary.length === 0 && <span className="omada-schedp-none">{t('schedp.none')}</span>}
            {summary.map((s) => (
              <span key={s.d} className="omada-schedp-sumday">
                <strong>{t(DAY_KEYS[s.d])}</strong>
                {s.ranges.map((r, i) => {
                  const st = stateOf(r.state);
                  return (
                    <span key={i} className={'omada-schedp-sumrange is-' + (st && (st.cls || st.key) || 'allow')}>
                      <span className="omada-schedp-sumdot" style={st && st.color ? { background: st.color } : undefined} />
                      <span className="omada-schedp-sumtime">{pad(r.from)}:00–{r.to === 24 ? '24:00' : pad(r.to) + ':00'}</span>
                      {st ? stateLabel(st) : r.state}
                    </span>
                  );
                })}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.SchedulePicker = OmadaSchedulePicker;
})();
