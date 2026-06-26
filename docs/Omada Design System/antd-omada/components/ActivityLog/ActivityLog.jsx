/* ────────────────────────────────────────────────────────────────────────
   components/ActivityLog/ActivityLog.jsx — OmadaActivityLog

   An activity / audit-log FEED. A reverse-chronological stream of events,
   GROUPED by day (Today / Yesterday / date), each row a leading tone icon
   disc + a sentence (actor · action · target chip) + a right-aligned relative
   timestamp, with a "load more" footer that reveals the next page and reports
   how many remain.

   Behaviour:
     · Feed `items`: { key, icon, tone, actor, action, target?, time(Date|ms),
       meta? }. Items are sorted newest-first and bucketed by calendar day.
       Day headers read "Today"/"Yesterday" (localized) else a locale date.
     · `pageSize` controls the initial slice; "Load more" appends another page
       (purely client paging over the passed array — no transport here). When
       everything is shown the footer hides.
     · Timestamps render relative ("3m", "2h", "Today 14:02") via a small
       formatter that respects the active language.
     · Tone (brand/blue/orange/red/neutral) drives the disc colour from the
       Omada ramp; every colour is a theme var with a dark twin.

   Thin composition over OmadaIcon + a connecting rail. RTL-safe (rail + time
   side mirror). No antd Timeline fork — this is the denser audit variant.

   Figma: Change Log 更新日志 node 25331:73512 (green header, rounded row cards,
   numbered disc, "Updated By" actor + avatar). Original feed redraw.
   Exports: window.Omada.ActivityLog
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const Icon = window.Omada.Icon;

  function startOfDay(d) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x.getTime(); }

  function relTime(time, lang) {
    const d = new Date(time);
    const now = Date.now();
    const diff = Math.max(0, now - d.getTime());
    const m = Math.floor(diff / 60000), h = Math.floor(diff / 3600000);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    if (m < 1) return lang === 'zh' ? '刚刚' : 'just now';
    if (m < 60) return m + (lang === 'zh' ? ' 分钟前' : 'm');
    if (h < 24 && startOfDay(d) === startOfDay(now)) return hh + ':' + mm;
    return hh + ':' + mm;
  }

  function dayLabel(ts, lang, t) {
    const today = startOfDay(Date.now());
    const day = startOfDay(ts);
    if (day === today) return t('alog.today');
    if (day === today - 86400000) return t('alog.yesterday');
    const d = new Date(ts);
    return d.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US',
      { month: 'short', day: 'numeric', year: d.getFullYear() === new Date().getFullYear() ? undefined : 'numeric' });
  }

  function OmadaActivityLog(props) {
    const { useState } = React;
    const className = props.className || '';
    const rest = Object.assign({}, props);
    delete rest.className; delete rest.items; delete rest.pageSize; delete rest.style;

    const ctx = window.useOmada ? window.useOmada() : null;
    const t = ctx ? ctx.t : (k) => k;
    const lang = ctx ? ctx.lang : 'en';

    const all = (props.items || []).slice().sort((a, b) => new Date(b.time) - new Date(a.time));
    const pageSize = props.pageSize || 6;
    const [count, setCount] = useState(pageSize);

    const shown = all.slice(0, count);
    const remaining = all.length - shown.length;

    // bucket the shown items by day, preserving order
    const groups = [];
    let cur = null;
    shown.forEach((it) => {
      const key = startOfDay(it.time);
      if (!cur || cur.key !== key) { cur = { key, label: dayLabel(it.time, lang, t), items: [] }; groups.push(cur); }
      cur.items.push(it);
    });

    return (
      <div className={('omada-alog ' + className).trim()} style={props.style} {...rest}>
        {groups.map((g) => (
          <section className="omada-alog-group" key={g.key}>
            <div className="omada-alog-daterow">
              <span className="omada-alog-date">{g.label}</span>
              <span className="omada-alog-count">{g.items.length}</span>
            </div>
            <ul className="omada-alog-list" role="list">
              {g.items.map((it) => (
                <li className="omada-alog-item" key={it.key}>
                  <span className={'omada-alog-disc is-' + (it.tone || 'neutral')}>
                    <Icon name={it.icon || 'circle'} size={15} />
                  </span>
                  <div className="omada-alog-body">
                    <p className="omada-alog-text">
                      {it.actor && <strong className="omada-alog-actor">{it.actor}</strong>}
                      {' '}{it.action}
                      {it.target && <span className="omada-alog-target">{it.target}</span>}
                    </p>
                    {it.meta && <span className="omada-alog-meta">{it.meta}</span>}
                  </div>
                  <time className="omada-alog-time">{relTime(it.time, lang)}</time>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {remaining > 0 && (
          <button type="button" className="omada-alog-more" onClick={() => setCount((c) => c + pageSize)}>
            <Icon name="chevron-down" size={15} />
            {t('alog.loadmore')} <span className="omada-alog-rem">{remaining}</span>
          </button>
        )}
      </div>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.ActivityLog = OmadaActivityLog;
})();
