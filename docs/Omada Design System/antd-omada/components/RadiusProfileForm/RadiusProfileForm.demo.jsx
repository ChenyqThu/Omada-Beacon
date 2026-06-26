/* components/RadiusProfileForm/RadiusProfileForm.demo.jsx — window.OmadaDemos.RadiusProfileForm */
(function () {
  const RadiusProfileForm = window.Omada.RadiusProfileForm;

  function RadiusProfileFormDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;
    return (
      <div className="omada-b27-demo">
        <div className="omada-b27-blocktitle">{t('radius.b.profile')}</div>
        <RadiusProfileForm
          defaultName="corp-wifi"
          defaultServer="10.0.8.21"
          defaultSecret="s3cr3t-k3y"
          defaultAccounting={true}
          defaultAcctServer="10.0.8.21"
        />
        <p className="omada-b27-pagehint">{t('radius.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.RadiusProfileForm = RadiusProfileFormDemo;
})();
