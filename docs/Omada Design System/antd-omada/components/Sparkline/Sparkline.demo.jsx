/* components/Sparkline/Sparkline.demo.jsx — window.OmadaDemos.Sparkline */
(function () {
  const { Sparkline } = window.Omada;
  const { Icon } = window.Omada;

  const up = [12, 14, 13, 18, 17, 22, 21, 26, 30];
  const down = [40, 38, 39, 34, 30, 31, 26, 22, 18];
  const wavy = [20, 24, 18, 26, 22, 28, 24, 30, 27];

  function Tile({ label, value, delta, tone, data }) {
    const isUp = tone === 'up';
    return (
      <div className="omada-spark-tile">
        <div className="omada-spark-meta">
          <div className="omada-spark-label">{label}</div>
          <div className="omada-spark-value">{value}</div>
          <div className={'omada-spark-delta ' + (isUp ? 'is-up' : 'is-down')}>
            <Icon name={isUp ? 'trending-up' : 'trending-down'} size={14} />
            {delta}
          </div>
        </div>
        <Sparkline data={data} tone={tone} height={48} width={120} />
      </div>
    );
  }

  function SparklineDemo() {
    const { t } = window.useOmada();
    return (
      <div>
        <div className="grid-3" style={{ gap: '14px 14px' }}>
          <Tile label={t('stat.clients')} value="1,284" delta="+12%" tone="up" data={up} />
          <Tile label={t('chart.s.download')} value="940 Mbps" delta="+6%" tone="up" data={wavy} />
          <Tile label={t('chart.appMix')} value="3.2%" delta="-18%" tone="down" data={down} />
        </div>

        <div className="row" style={{ marginTop: 20, gap: 28 }}>
          <span className="label">tones</span>
          <Sparkline data={up} tone="up" width={110} />
          <Sparkline data={down} tone="down" width={110} />
          <Sparkline data={wavy} tone="neutral" width={110} />
          <Sparkline data={wavy} tone="brand" area={false} width={110} />
        </div>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Sparkline = SparklineDemo;
})();
