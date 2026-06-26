/* ────────────────────────────────────────────────────────────────────────
   components/Calendar/Calendar.jsx — OmadaCalendar

   Thin wrapper over antd Calendar (fullscreen month grid). Matches the Figma
   "Calendar 日历": collapsed 1px cell borders, right-aligned date number, a
   3px brand-green top accent + green-10% wash on the selected / today cell,
   and per-day event rows tinted success(green)/warning(orange)/error(red).

   `events` is a map keyed 'YYYY-MM-DD' → [{ tone, text }]; the wrapper
   supplies a default `cellRender` that paints those rows (status colour from
   the semantic tokens). The selected-cell accent + grid borders are the only
   things tokens can't express → omada-overrides.css (+ dark twin).

   Header (year/month selects + Month/Year switch) is antd's default, themed
   by the Omada token set. Month names + week start follow ConfigProvider
   locale (zhCN | enUS).

   Figma: Calendar 日历 node 43:34747 — selected cell inset 0 3px 0 0 #00A870,
   bg rgba(0,168,112,0.1); event text rows orange/green/red.
   Exports: window.Omada.Calendar
   ──────────────────────────────────────────────────────────────────────── */

const { Calendar: AntCalendar } = window.antd;

function OmadaCalendar({ events, cellRender, className = '', ...rest }) {
  const toneColor = {
    success: 'var(--om-cal-success)',
    warning: 'var(--om-cal-warning)',
    error:   'var(--om-cal-error)',
  };

  const defaultCellRender = (current, info) => {
    if (cellRender) return cellRender(current, info);
    if (info.type !== 'date' || !events) return info.originNode;
    const key = current.format('YYYY-MM-DD');
    const list = events[key];
    if (!list || !list.length) return null;
    return (
      <ul className="omada-cal-events">
        {list.map((e, i) => (
          <li key={i} className="omada-cal-event" style={{ color: toneColor[e.tone] || toneColor.success }}>
            <span className="omada-cal-event-dot" />
            <span className="omada-cal-event-text">{e.text}</span>
          </li>
        ))}
      </ul>
    );
  };

  const cls = ('omada-calendar ' + className).trim();
  return <AntCalendar className={cls} cellRender={defaultCellRender} {...rest} />;
}

window.Omada = window.Omada || {};
window.Omada.Calendar = OmadaCalendar;
