/* components/TwoFactorSetup/TwoFactorSetup.demo.jsx — window.OmadaDemos.TwoFactorSetup */
(function () {
  const TwoFactorSetup = window.Omada.TwoFactorSetup;

  function TwoFactorSetupDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;
    return (
      <div className="omada-tfa-demo">
        <TwoFactorSetup account="admin@hq-campus" />
        <p className="omada-tfa-pagehint">{t('tfa.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.TwoFactorSetup = TwoFactorSetupDemo;
})();
