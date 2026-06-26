/* components/PieChart/PieChart.demo.jsx — window.OmadaDemos.PieChart */
(function () {
  const { PieChart, ChartCard } = window.Omada;
  const RAMP = ['#05C178', '#A6EF00', '#0069CB', '#F476FF', '#FF8C27', '#EE385C'];

  function LegendList({ data }) {
    const total = data.reduce((a, d) => a + d.value, 0);
    return (
      <div className="omada-pielegend">
        {data.map((d, i) => (
          <div className="omada-pielegend-row" key={i}>
            <span className="omada-pielegend-dot" style={{ background: RAMP[i % RAMP.length] }} />
            <span className="omada-pielegend-label">{d.name}</span>
            <span className="omada-pielegend-val">{Math.round((d.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    );
  }

  function PieChartDemo() {
    const { t } = window.useOmada();

    const apps = [
      { name: t('chart.app.web'),    value: 38 },
      { name: t('chart.app.video'),  value: 26 },
      { name: t('chart.app.voip'),   value: 14 },
      { name: t('chart.app.social'), value: 11 },
      { name: t('chart.app.gaming'), value: 7 },
      { name: t('chart.app.other'),  value: 4 },
    ];
    const devices = [
      { name: t('chart.dev.ap'),      value: 48 },
      { name: t('chart.dev.switch'),  value: 16 },
      { name: t('chart.dev.gateway'), value: 4 },
      { name: t('chart.dev.camera'),  value: 12 },
    ];

    return (
      <div className="grid-2" style={{ alignItems: 'start', gap: '18px 18px' }}>
        <ChartCard title={t('chart.appMix')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: '1 1 0', minWidth: 0 }}>
              <PieChart data={apps} variant="donut" centerTitle="2.4 TB" centerSub={t('chart.total').toUpperCase()} height={240} />
            </div>
            <LegendList data={apps} />
          </div>
        </ChartCard>

        <ChartCard title={t('chart.deviceMix')}>
          <PieChart data={devices} variant="donut" showLegend="bottom"
            centerTitle="80" centerSub={t('chart.total').toUpperCase()} height={260} />
        </ChartCard>

        <ChartCard title={t('chart.appMix')}>
          <PieChart data={apps} variant="pie" showLegend="bottom" height={260} />
        </ChartCard>

        <ChartCard title={t('chart.deviceMix')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: '1 1 0', minWidth: 0 }}>
              <PieChart data={devices} variant="donut" centerTitle="80" centerSub={t('chart.total').toUpperCase()} height={240} />
            </div>
            <LegendList data={devices} />
          </div>
        </ChartCard>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.PieChart = PieChartDemo;
})();
