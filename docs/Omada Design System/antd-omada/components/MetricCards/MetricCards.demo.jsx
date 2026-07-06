/* components/MetricCards/MetricCards.demo.jsx — window.OmadaDemos.MetricCards */
(function () {
  const MetricCards = window.Omada.MetricCards;

  function MetricCardsDemo() {
    const { useState } = React;
    const ctx = window.useOmada();
    const t = ctx.t;
    const [range, setRange] = useState('7d');

    const ranges = [
      { value: '24h', label: t('mc.r.24h') },
      { value: '7d', label: t('mc.r.7d') },
      { value: '30d', label: t('mc.r.30d') },
    ];

    const metrics = [
      { key: 'devices', label: t('mc.m.devices'), icon: 'devices', tone: 'brand', value: '248', delta: { dir: 'up', value: '+6' }, vs: t('mc.vs'), spark: [220, 228, 225, 234, 240, 244, 248], range: { min: 218, max: 251 } },
      { key: 'clients', label: t('mc.m.clients'), icon: 'clients', tone: 'blue', value: '3,914', delta: { dir: 'up', value: '8.2%' }, vs: t('mc.vs'), spark: [3100, 3300, 3250, 3600, 3700, 3850, 3914] },
      { key: 'through', label: t('mc.m.throughput'), icon: 'trending-up', tone: 'magenta', value: '1.82', unit: 'Gbps', delta: { dir: 'down', value: '3.1%' }, vs: t('mc.vs'), spark: [2.1, 2.0, 1.95, 1.9, 1.88, 1.85, 1.82] },
      { key: 'latency', label: t('mc.m.latency'), icon: 'clock', tone: 'orange', value: '14', unit: 'ms', delta: { dir: 'down', value: '2 ms' }, goodWhenDown: true, vs: t('mc.vs'), spark: [22, 20, 19, 17, 16, 15, 14], range: { min: 9, max: 31, unit: 'ms' } },
      { key: 'alerts', label: t('mc.m.alerts'), icon: 'alerts', tone: 'red', value: '5', delta: { dir: 'down', value: '40%' }, goodWhenDown: true, vs: t('mc.vs') },
      { key: 'uptime', label: t('mc.m.uptime'), icon: 'check-circle', tone: 'brand', value: '99.98', unit: '%', delta: { dir: 'flat', value: '0.0' }, vs: t('mc.vs'), rangeText: t('mc.sla') + ' 99.9%' },
    ];

    return (
      <div className="omada-mc-demo">
        <MetricCards title={t('mc.title')} ranges={ranges} range={range} onRangeChange={setRange} metrics={metrics} />
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.MetricCards = MetricCardsDemo;
})();
