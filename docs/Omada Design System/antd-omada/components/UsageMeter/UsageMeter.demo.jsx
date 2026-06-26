/* components/UsageMeter/UsageMeter.demo.jsx — window.OmadaDemos.UsageMeter */
(function () {
  const UsageMeter = window.Omada.UsageMeter;
  const Icon = window.Omada.Icon;
  const { Slider } = window.antd;

  function UsageMeterDemo() {
    const { useState } = React;
    const ctx = window.useOmada();
    const t = ctx.t;

    const [storage, setStorage] = useState(182);

    const meters = [
      { key: 'storage', label: t('meter.m.storage'), icon: 'cloud', used: storage, total: 250, unit: ' GB' },
      { key: 'licenses', label: t('meter.m.licenses'), icon: 'devices', used: 48, total: 50, format: (v) => v + ' ' + t('meter.devices') },
      { key: 'sites', label: t('meter.m.sites'), icon: 'map', used: 12, total: 40, format: (v) => String(v) },
      { key: 'api', label: t('meter.m.api'), icon: 'globe', used: 9600, total: 10000, format: (v) => (v >= 1000 ? (v / 1000) + 'k' : v) },
    ];

    const breakdown = [
      { key: 'bw', label: t('meter.m.bandwidth'), total: 1000, unit: ' GB',
        segments: [
          { label: t('meter.seg.video'), value: 420 },
          { label: t('meter.seg.web'), value: 260 },
          { label: t('meter.seg.voip'), value: 110 },
          { label: t('meter.seg.other'), value: 95 },
        ] },
    ];

    const rings = [
      { key: 'cpu', label: t('meter.m.cpu'), used: 34, total: 100, unit: '%' },
      { key: 'mem', label: t('meter.m.mem'), used: 78, total: 100, unit: '%' },
      { key: 'disk', label: t('meter.m.disk'), used: 93, total: 100, unit: '%' },
    ];

    return (
      <div className="omada-meter-demo">
        <div className="omada-meter-block">
          <div className="omada-meter-blocktitle">{t('meter.b.quotas')}</div>
          <UsageMeter meters={meters} columns={2} />
          <div className="omada-meter-sliderrow">
            <span className="omada-meter-sliderlabel"><Icon name="sliders" size={14} />{t('meter.tryit')}</span>
            <Slider min={0} max={300} value={storage} onChange={setStorage} style={{ flex: 1 }} />
          </div>
        </div>

        <div className="omada-meter-block">
          <div className="omada-meter-blocktitle">{t('meter.b.breakdown')}</div>
          <UsageMeter meters={breakdown} />
        </div>

        <div className="omada-meter-block">
          <div className="omada-meter-blocktitle">{t('meter.b.health')}</div>
          <UsageMeter meters={rings} variant="ring" columns={3} />
        </div>

        <p className="omada-meter-pagehint">{t('meter.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.UsageMeter = UsageMeterDemo;
})();
