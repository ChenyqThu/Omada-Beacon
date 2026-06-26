/* components/MaintenanceBanner/MaintenanceBanner.demo.jsx — window.OmadaDemos.MaintenanceBanner */
(function () {
  const MaintenanceBanner = window.Omada.MaintenanceBanner;
  const { Segmented, Button } = window.antd;

  function MaintenanceBannerDemo() {
    const { useState, useMemo } = React;
    const ctx = window.useOmada();
    const t = ctx.t;

    const [scenario, setScenario] = useState('upcoming');
    // key by scenario so dismiss state resets when switching
    const win = useMemo(() => {
      const now = Date.now();
      const h = 3600000;
      if (scenario === 'upcoming') return { start: now + 2 * h + 14 * 60000, end: now + 4 * h };
      if (scenario === 'soon') return { start: now + 95 * 1000, end: now + 0.5 * h };
      if (scenario === 'active') return { start: now - 0.4 * h, end: now + 41 * 60000 };
      return { start: now - 3 * h, end: now - 1000 };
    }, [scenario]);

    return (
      <div className="omada-maintb-demo">
        <div className="omada-maintb-toolbar">
          <Segmented
            size="small"
            value={scenario}
            onChange={setScenario}
            options={[
              { value: 'upcoming', label: t('maintb.sc.upcoming') },
              { value: 'soon', label: t('maintb.sc.soon') },
              { value: 'active', label: t('maintb.sc.active') },
              { value: 'done', label: t('maintb.sc.done') },
            ]}
          />
        </div>
        <MaintenanceBanner
          key={scenario}
          start={win.start}
          end={win.end}
          message={t('maintb.d.msg')}
          actions={<Button size="small">{t('maintb.details')}</Button>}
        />
        <p className="omada-maintb-pagehint">{t('maintb.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.MaintenanceBanner = MaintenanceBannerDemo;
})();
