/* ────────────────────────────────────────────────────────────────────────
   components/HeatCalendar/HeatCalendar.jsx — OmadaHeatCalendar

   A GitHub-style ACTIVITY HEAT MAP: weeks as columns × Mon–Sun rows,
   ending today. Cell intensity quantises the day's value into 5 levels
   of the brand-green ramp; hovering shows date + value via Tooltip.
   Month labels sit above the first full week of each month; a
   Less → More legend and a localized total round it out.

     · `values` — { 'YYYY-MM-DD': number } event counts per day.
     · `weeks`  — columns to render (default 26).
     · `formatValue(n)` — tooltip value text (default '{n} events').
     · `onSelect(dateISO, value)` — click observer.

   Distinct from SchedulePicker (Batch 25 — an EDITABLE week×hour
   drag-paint grid): this is a read-only day×week density VIEW.

   Token-driven, dark twin, i18n. The grid keeps LTR time order in RTL
   (calendar weeks read oldest → newest like code/diff panes).
   Figma: no dedicated node this session (VFS permission pending) —
   colours quantise the OMADA green ramp; cell metrics follow
   SchedulePicker.
   Exports: window.Omada.HeatCalendar
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Tooltip } = window.antd;

  const DAY = 86400000;

  function iso(d) {
    const y = d.getFullYear(), m = d.getMonth() + 1, dd = d.getDate();
    return y + '-' + (m < 10 ? '0' + m : m) + '-' + (dd < 10 ? '0' + dd : dd);
  }

  function OmadaHeatCalendar(props) {
    const { useMemo } = React;
    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;
    const lang = ctx ? ctx.lang : 'en';

    const weeks = props.weeks || 26;
    const values = props.values || {};

    const grid = useMemo(() => {
      // columns of 7 days (Mon..Sun), last column contains today
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const dow = (today.getDay() + 6) % 7; // Mon=0
      const lastMonday = new Date(today.getTime() - dow * DAY);
      const cols = [];
      for (let w = weeks - 1; w >= 0; w--) {
        const monday = new Date(lastMonday.getTime() - w * 7 * DAY);
        const days = [];
        for (let d = 0; d < 7; d++) {
          const date = new Date(monday.getTime() + d * DAY);
          if (date > today) { days.push(null); continue; }
          const key = iso(date);
          days.push({ key, date, value: values[key] || 0 });
        }
        cols.push(days);
      }
      return cols;
    }, [weeks, values]);

    const max = useMemo(() => {
      let m = 0;
      grid.forEach((col) => col.forEach((c) => { if (c && c.value > m) m = c.value; }));
      return Math.max(1, m);
    }, [grid]);

    const level = (v) => (v <= 0 ? 0 : Math.min(4, 1 + Math.floor((v / max) * 3.999)));

    const total = useMemo(() => {
      let s = 0;
      grid.forEach((col) => col.forEach((c) => { if (c) s += c.value; }));
      return s;
    }, [grid]);

    const locale = lang === 'zh' ? 'zh-CN' : 'en-US';
    const monthLabels = grid.map((col, i) => {
      const first = col[0];
      if (!first) return null;
      const m = first.date.getMonth();
      if (i === 0) return null; // avoid clipping a partial first label
      const prev = grid[i - 1][0];
      if (prev && prev.date.getMonth() !== m) {
        return first.date.toLocaleDateString(locale, { month: 'short' });
      }
      return null;
    });

    const fmtVal = props.formatValue || ((n) => (n === 0 ? t('hcal.noevents') : t('hcal.events').replace('{n}', n)));
    const fmtDate = (d) => d.toLocaleDateString(locale, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

    const wdLabel = (i) => {
      const base = new Date(2026, 0, 5 + i); // a Monday
      return base.toLocaleDateString(locale, { weekday: 'short' });
    };

    return (
      <div className={'omada-hcal' + (props.className ? ' ' + props.className : '')}>
        <div className="omada-hcal-scroll">
          <div className="omada-hcal-grid" role="img"
               aria-label={t('hcal.total').replace('{n}', total).replace('{w}', weeks)}>
            <div className="omada-hcal-months">
              <span className="omada-hcal-wdspacer" />
              {monthLabels.map((m, i) => (
                <span key={i} className="omada-hcal-month">{m || ''}</span>
              ))}
            </div>
            <div className="omada-hcal-body">
              <div className="omada-hcal-wd">
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <span key={i} className="omada-hcal-wdlabel">{i % 2 === 0 ? wdLabel(i) : ''}</span>
                ))}
              </div>
              {grid.map((col, ci) => (
                <div key={ci} className="omada-hcal-col">
                  {col.map((c, di) => c == null
                    ? <span key={di} className="omada-hcal-cell is-void" />
                    : (
                      <Tooltip key={di} title={<span className="omada-hcal-tip">{fmtVal(c.value)} · {fmtDate(c.date)}</span>} mouseEnterDelay={0.05}>
                        <span
                          className={'omada-hcal-cell is-l' + level(c.value)}
                          tabIndex={props.onSelect ? 0 : -1}
                          onClick={() => { if (props.onSelect) props.onSelect(c.key, c.value); }}
                        />
                      </Tooltip>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="omada-hcal-foot">
          <span className="omada-hcal-total">{t('hcal.total').replace('{n}', total).replace('{w}', weeks)}</span>
          <span className="omada-hcal-legend">
            {t('hcal.less')}
            {[0, 1, 2, 3, 4].map((l) => <span key={l} className={'omada-hcal-cell is-l' + l} />)}
            {t('hcal.more')}
          </span>
        </div>
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.HeatCalendar = OmadaHeatCalendar;
})();
