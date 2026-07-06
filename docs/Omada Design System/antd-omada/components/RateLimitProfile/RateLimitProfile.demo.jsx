/* components/RateLimitProfile/RateLimitProfile.demo.jsx — window.OmadaDemos.RateLimitProfile */
(function () {
  const RateLimitProfile = window.Omada.RateLimitProfile;

  function RateLimitProfileDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;
    return (
      <div className="omada-b28-demo">
        <div className="omada-b28-blocktitle">{t('rlp.b.profiles')}</div>
        <RateLimitProfile />
        <p className="omada-b28-pagehint">{t('rlp.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.RateLimitProfile = RateLimitProfileDemo;
})();
