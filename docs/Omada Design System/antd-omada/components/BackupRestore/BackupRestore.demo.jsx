/* components/BackupRestore/BackupRestore.demo.jsx — window.OmadaDemos.BackupRestore */
(function () {
  const BackupRestore = window.Omada.BackupRestore;

  function BackupRestoreDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;
    return (
      <div className="omada-b28-demo">
        <div className="omada-b28-blocktitle">{t('bkr.b.list')}</div>
        <BackupRestore />
        <p className="omada-b28-pagehint">{t('bkr.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.BackupRestore = BackupRestoreDemo;
})();
