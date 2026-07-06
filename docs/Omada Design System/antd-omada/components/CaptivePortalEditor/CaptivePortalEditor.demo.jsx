/* components/CaptivePortalEditor/CaptivePortalEditor.demo.jsx — window.OmadaDemos.CaptivePortalEditor */
(function () {
  const CaptivePortalEditor = window.Omada.CaptivePortalEditor;

  function CaptivePortalEditorDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;
    return (
      <div className="omada-b28-demo">
        <div className="omada-b28-blocktitle">{t('cpe.b.editor')}</div>
        <CaptivePortalEditor defaultAuth="voucher" />
        <p className="omada-b28-pagehint">{t('cpe.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.CaptivePortalEditor = CaptivePortalEditorDemo;
})();
