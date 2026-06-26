/* components/TrafficSparkline/TrafficSparkline.demo.jsx — window.OmadaDemos.TrafficSparkline */
(function () {
  const TrafficSparkline = window.Omada.TrafficSparkline;

  function TrafficSparklineDemo() {
    const { useMemo } = React;
    const ctx = window.useOmada();
    const t = ctx.t;

    const rows = useMemo(() => ([
      { key: 'wan1', label: t('tspark.r.wan1'), icon: 'globe',
        data: [310, 330, 315, 360, 420, 405, 470, 520, 540, 525, 580, 610], unit: ' Mbps' },
      { key: 'wan2', label: t('tspark.r.wan2'), icon: 'globe',
        data: [80, 76, 82, 79, 81, 80, 78, 83, 80, 82, 79, 81], unit: ' Mbps' },
      { key: 'vpn', label: t('tspark.r.vpn'), icon: 'lock',
        data: [42, 45, 44, 39, 36, 30, 28, 24, 22, 19, 16, 14], unit: ' Mbps' },
      { key: 'guest', label: t('tspark.r.guest'), icon: 'wifi',
        data: [12, 18, 25, 31, 28, 36, 44, 41, 52, 58, 63, 70], unit: ' Mbps' },
      { key: 'iot', label: t('tspark.r.iot'), icon: 'devices',
        data: [4, 4.2, 3.9, 4.1, 4, 4.3, 4.1, 4, 4.2, 4.1, 4, 4.1], unit: ' Mbps' },
    ]), [t]);

    return (
      <div className="omada-tspark-demo">
        <div className="omada-tspark-block">
          <div className="omada-tspark-blocktitle">{t('tspark.b.rows')}</div>
          <TrafficSparkline rows={rows} />
        </div>
        <p className="omada-tspark-pagehint">{t('tspark.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.TrafficSparkline = TrafficSparklineDemo;
})();
