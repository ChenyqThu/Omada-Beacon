/* components/Gauge/Gauge.demo.jsx — window.OmadaDemos.Gauge */
(function () {
  const { Gauge, ChartCard } = window.Omada;

  function GaugeDemo() {
    const { t } = window.useOmada();
    return (
      <div className="grid-3" style={{ alignItems: 'start', gap: '18px 18px' }}>
        <ChartCard title={t('chart.health')}>
          <Gauge value={86} label={t('chart.band.good')} variant="progress" height={210} />
        </ChartCard>

        <ChartCard title={t('chart.signal')}>
          <Gauge value={72} label={t('chart.band.good')} variant="zoned" height={210} />
        </ChartCard>

        <ChartCard title={t('chart.apLoad')}>
          <Gauge value={54} label={t('chart.unit.clients')} unit="" variant="progress"
            color="#FF8C27" max={100} height={210} />
        </ChartCard>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Gauge = GaugeDemo;
})();
