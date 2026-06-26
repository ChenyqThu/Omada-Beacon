/* components/Banner/Banner.demo.jsx — window.OmadaDemos.Banner */
(function () {
  const Banner = window.Omada.Banner;
  const { Button } = window.antd;

  function BannerDemo() {
    const { useState } = React;
    const ctx = window.useOmada();
    const t = ctx.t;
    const { App } = window.antd;
    const appApi = App.useApp ? App.useApp() : null;
    const msg = appApi && appApi.message ? appApi.message : { info: () => {} };

    // bump to force-remount the stack after we clear localStorage flags
    const [nonce, setNonce] = useState(0);

    const ids = ['demo.maint', 'demo.fw', 'demo.trial', 'demo.outage'];
    const items = [
      { id: 'demo.maint', tone: 'info', icon: 'clock', message: t('bn.maint.msg'),
        action: { label: t('bn.maint.action'), icon: 'calendar', onClick: () => msg.info(t('bn.maint.action')) } },
      { id: 'demo.fw', tone: 'success', icon: 'rocket', message: t('bn.fw.msg'),
        action: { label: t('bn.fw.action'), onClick: () => msg.info(t('bn.fw.action')) } },
      { id: 'demo.trial', tone: 'warning', icon: 'star', message: t('bn.trial.msg'),
        action: { label: t('bn.trial.action'), onClick: () => msg.info(t('bn.trial.action')) } },
      { id: 'demo.outage', tone: 'critical', icon: 'warning', message: t('bn.outage.msg'),
        action: { label: t('bn.outage.action'), icon: 'external-link', onClick: () => msg.info(t('bn.outage.action')) } },
    ];

    const restore = () => { Banner.reset(ids); setNonce((n) => n + 1); };

    return (
      <div className="omada-banner-demo">
        <Banner.Stack key={nonce} items={items} />
        {/* non-dismissable brand banner shows the no-close variant */}
        <Banner tone="brand" icon="rocket" closable={false} message={t('bn.brand.msg')}
                action={{ label: t('bn.brand.action'), onClick: () => msg.info(t('bn.brand.action')) }} />
        <div className="omada-banner-demobar">
          <span className="omada-banner-demohint">{t('bn.persisthint')}</span>
          <Button size="small" type="text" icon={<window.Omada.Icon name="refresh" size={14} />} onClick={restore}>
            {t('bn.resetall')}
          </Button>
        </div>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Banner = BannerDemo;
})();
