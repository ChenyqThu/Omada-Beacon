/* components/BarChart/BarChart.demo.jsx — window.OmadaDemos.BarChart */
(function () {
  const { BarChart, ChartCard } = window.Omada;

  function BarChartDemo() {
    const { t } = window.useOmada();
    const days = [t('chart.d.mon'), t('chart.d.tue'), t('chart.d.wed'), t('chart.d.thu'), t('chart.d.fri'), t('chart.d.sat'), t('chart.d.sun')];

    const single = [{ name: t('chart.s.thisWeek'), data: [180, 210, 175, 220, 195, 120, 90] }];
    const grouped = [
      { name: t('chart.s.thisWeek'), data: [180, 210, 175, 220, 195, 120, 90] },
      { name: t('chart.s.lastWeek'), data: [150, 165, 160, 190, 170, 100, 80], color: '#0069CB' },
    ];
    const stacked = [
      { name: t('chart.s.2g'), data: [60, 72, 55, 80, 68, 40, 30] },
      { name: t('chart.s.5g'), data: [80, 95, 85, 100, 90, 55, 42], color: '#0069CB' },
      { name: t('chart.s.6g'), data: [30, 38, 28, 40, 35, 20, 15], color: '#FF8C27' },
    ];
    // horizontal — top APs by client count
    const aps = ['EAP670-3F', 'EAP650-2F', 'EAP610-1F', 'EAP660-4F', 'EAP615-LB'];
    const horizontal = [{ name: t('chart.unit.clients'), data: [142, 118, 96, 74, 52] }];

    return (
      <div className="grid-2" style={{ alignItems: 'start', gap: '18px 18px' }}>
        <ChartCard title={t('chart.clientsTrend')}>
          <BarChart xData={days} series={single} variant="column" legend={false} height={240} />
        </ChartCard>

        <ChartCard title={t('chart.clientsTrend')}>
          <BarChart xData={days} series={grouped} variant="column" height={240} />
        </ChartCard>

        <ChartCard title={t('chart.bandUsage')}>
          <BarChart xData={days} series={stacked} variant="column" stack height={240} />
        </ChartCard>

        <ChartCard title={t('chart.apLoad')}>
          <BarChart xData={aps} series={horizontal} variant="bar" legend={false} height={240} />
        </ChartCard>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.BarChart = BarChartDemo;
})();
