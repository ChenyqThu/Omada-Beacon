/* components/HeatCalendar/HeatCalendar.demo.jsx — window.OmadaDemos.HeatCalendar */
(function () {
  const HeatCalendar = window.Omada.HeatCalendar;

  // deterministic pseudo-random day values (seeded, weekday-weighted)
  function genValues(weeks) {
    const DAY = 86400000;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const out = {};
    let seed = 42;
    const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
    for (let i = weeks * 7; i >= 0; i--) {
      const d = new Date(today.getTime() - i * DAY);
      const dow = (d.getDay() + 6) % 7;
      const weekday = dow < 5;
      const r = rnd();
      let v = 0;
      if (r > (weekday ? 0.18 : 0.55)) v = Math.round(r * (weekday ? 22 : 9));
      if (rnd() > 0.965) v += Math.round(30 + rnd() * 25); // incident spikes
      const y = d.getFullYear(), m = d.getMonth() + 1, dd = d.getDate();
      out[y + '-' + (m < 10 ? '0' + m : m) + '-' + (dd < 10 ? '0' + dd : dd)] = v;
    }
    return out;
  }

  const VALUES = genValues(26);

  function HeatCalendarDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;
    return (
      <div className="omada-hcal-demo">
        <div className="omada-hcal-blocktitle">{t('hcal.b.alerts')}</div>
        <HeatCalendar values={VALUES} weeks={26} />
        <p className="omada-hcal-pagehint">{t('hcal.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.HeatCalendar = HeatCalendarDemo;
})();
