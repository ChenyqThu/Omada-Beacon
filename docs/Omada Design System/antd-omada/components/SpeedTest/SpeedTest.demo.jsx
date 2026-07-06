/* components/SpeedTest/SpeedTest.demo.jsx — window.OmadaDemos.SpeedTest */
(function () {
  const SpeedTest = window.Omada.SpeedTest;

  const SEED = [
    { down: 412, up: 268 }, { down: 455, up: 290 }, { down: 430, up: 301 },
    { down: 471, up: 280 }, { down: 392, up: 244 }, { down: 468, up: 305 },
    { down: 480, up: 312 }, { down: 441, up: 287 },
  ];

  function SpeedTestDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;
    return (
      <div className="omada-spt-demo">
        <SpeedTest
          meta={t('spt.d.server')}
          target={{ latency: 14, jitter: 3, down: 487, up: 312 }}
          history={SEED}
        />
        <p className="omada-spt-pagehint">{t('spt.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.SpeedTest = SpeedTestDemo;
})();
