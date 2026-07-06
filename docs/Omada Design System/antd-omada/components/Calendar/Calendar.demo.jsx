/* components/Calendar/Calendar.demo.jsx — window.OmadaDemos.Calendar */
(function () {
  const { Calendar } = window.Omada;

  function CalendarDemo() {
    const { t } = window.useOmada();
    const dayjs = window.dayjs;
    const base = dayjs();
    const d = (n) => base.date(n).format('YYYY-MM-DD');

    const events = {
      [d(8)]:  [{ tone: 'success', text: t('cal.maintenance') }],
      [d(12)]: [{ tone: 'warning', text: t('cal.firmware') }, { tone: 'success', text: t('cal.reboot') }],
      [d(18)]: [{ tone: 'error',   text: t('cal.outage') }],
      [d(19)]: [{ tone: 'success', text: t('cal.reboot') }],
      [d(25)]: [{ tone: 'warning', text: t('cal.firmware') }, { tone: 'error', text: t('cal.outage') }, { tone: 'success', text: t('cal.maintenance') }],
    };

    return (
      <div style={{ border: '1px solid var(--border-default)', borderRadius: 10, overflow: 'hidden' }}>
        <Calendar events={events} />
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Calendar = CalendarDemo;
})();
