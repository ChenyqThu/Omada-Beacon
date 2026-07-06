/* components/LineChart/LineChart.demo.jsx — window.OmadaDemos.LineChart */
(function () {
  const { LineChart, ChartCard } = window.Omada;

  const HOURS = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];

  function LineChartDemo() {
    const { t } = window.useOmada();

    const single = [{ name: t('chart.s.download'), data: [90, 92, 150, 120, 180, 175, 190] }];
    const dual = [
      { name: t('chart.s.download'), data: [90, 110, 150, 130, 180, 160, 195] },
      { name: t('chart.s.upload'),   data: [40, 55, 70, 60, 95, 80, 110], color: '#0069CB' },
    ];
    const triple = [
      { name: t('chart.s.2g'), data: [120, 118, 210, 205, 175, 215, 210] },
      { name: t('chart.s.5g'), data: [95, 92, 145, 138, 150, 158, 178], color: '#0069CB' },
      { name: t('chart.s.6g'), data: [55, 58, 92, 95, 80, 110, 120], color: '#FF8C27' },
    ];
    const stacked = [
      { name: t('chart.s.wired'),    data: [60, 70, 120, 120, 150, 150, 170] },
      { name: t('chart.s.wireless'), data: [40, 50, 80, 60, 70, 80, 90], color: '#0069CB' },
      { name: t('chart.s.guest'),    data: [15, 18, 30, 24, 28, 32, 40], color: '#F476FF' },
    ];

    return (
      <div className="grid-2" style={{ alignItems: 'start', gap: '18px 18px' }}>
        <ChartCard title={t('chart.throughput')} sub={t('chart.throughput.sub')}>
          <LineChart xData={HOURS} series={single} variant="area"
            yAxis={{ axisLabel: { formatter: '{value}' } }} height={240} />
        </ChartCard>

        <ChartCard title={t('chart.bandUsage')}>
          <LineChart xData={HOURS} series={dual} variant="area" height={240} />
        </ChartCard>

        <ChartCard title={t('chart.clientsTrend')}>
          <LineChart xData={HOURS} series={triple} variant="line" height={240} />
        </ChartCard>

        <ChartCard title={t('chart.apLoad')}>
          <LineChart xData={HOURS} series={stacked} variant="stack" height={240} />
        </ChartCard>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.LineChart = LineChartDemo;
})();
