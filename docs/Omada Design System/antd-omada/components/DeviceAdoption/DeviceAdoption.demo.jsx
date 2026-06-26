/* components/DeviceAdoption/DeviceAdoption.demo.jsx — window.OmadaDemos.DeviceAdoption */
(function () {
  const DeviceAdoption = window.Omada.DeviceAdoption;

  function DeviceAdoptionDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;
    return (
      <div className="omada-b28-demo">
        <div className="omada-b28-blocktitle">{t('dadopt.b.pending')}</div>
        <DeviceAdoption />
        <p className="omada-b28-pagehint">{t('dadopt.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.DeviceAdoption = DeviceAdoptionDemo;
})();
