/* components/WanFailover/WanFailover.demo.jsx — window.OmadaDemos.WanFailover */
(function () {
  const WanFailover = window.Omada.WanFailover;

  function WanFailoverDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;
    return (
      <div className="omada-b27-demo">
        <div className="omada-b27-blocktitle">{t('wanf.b.links')}</div>
        <WanFailover
          primary={{ name: 'WAN1 · Fiber', ip: '203.0.113.10', latency: 8 }}
          backup={{ name: 'WAN2 · LTE', ip: '10.64.21.7', latency: 41 }}
        />
        <p className="omada-b27-pagehint">{t('wanf.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.WanFailover = WanFailoverDemo;
})();
