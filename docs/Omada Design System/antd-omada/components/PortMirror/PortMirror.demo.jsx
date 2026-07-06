/* components/PortMirror/PortMirror.demo.jsx — window.OmadaDemos.PortMirror */
(function () {
  const PortMirror = window.Omada.PortMirror;

  function PortMirrorDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;
    return (
      <div className="omada-b28-demo">
        <div className="omada-b28-blocktitle">{t('pmir.b.session')}</div>
        <PortMirror />
        <p className="omada-b28-pagehint">{t('pmir.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.PortMirror = PortMirrorDemo;
})();
