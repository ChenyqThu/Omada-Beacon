/* components/UndoToast/UndoToast.demo.jsx — window.OmadaDemos.UndoToast */
(function () {
  const UndoToast = window.Omada.UndoToast;
  const Icon = window.Omada.Icon;
  const { Button, App } = window.antd;

  function UndoToastDemo() {
    const { useState } = React;
    const ctx = window.useOmada();
    const t = ctx.t;
    const undo = window.useUndo();
    const appApi = App.useApp ? App.useApp() : null;
    const msg = appApi && appApi.message ? appApi.message : { success: () => {}, info: () => {} };

    // a tiny stand-in list so Undo visibly restores something
    const SEED = [
      { id: 'd1', name: 'AP-Lobby-01' },
      { id: 'd2', name: 'SW-Core-02' },
      { id: 'd3', name: 'GW-Edge-01' },
      { id: 'd4', name: 'AP-Cafe-03' },
    ];
    const [rows, setRows] = useState(SEED);

    const deleteRow = (row) => {
      const before = rows;
      setRows((list) => list.filter((r) => r.id !== row.id));
      undo.push({
        message: t('undo.deleted').replace('{name}', row.name),
        tone: 'danger',
        icon: 'trash',
        onUndo: () => { setRows(before); msg.info(t('undo.restored').replace('{name}', row.name)); },
        onCommit: () => { msg.success(t('undo.committed').replace('{name}', row.name)); },
      });
    };

    const archiveAll = () => {
      const before = rows;
      const n = rows.length;
      if (!n) return;
      setRows([]);
      undo.push({
        message: t('undo.archivedN').replace('{n}', n),
        icon: 'inbox',
        duration: 8000,
        onUndo: () => { setRows(before); msg.info(t('undo.unarchived')); },
        onCommit: () => { msg.success(t('undo.archivecommit')); },
      });
    };

    const stickyToast = () => {
      undo.push({
        message: t('undo.sticky'),
        icon: 'warning',
        tone: 'danger',
        duration: 0,                 // never auto-commits — must Undo or dismiss
        onUndo: () => msg.info(t('undo.reverted')),
      });
    };

    return (
      <div className="omada-undo-demo">
        {/* the host lives once near the app root; scoped here for the demo */}
        <UndoToast.Host placement="bottom" max={3} />

        <div className="omada-undo-list" role="list">
          {rows.length === 0 && (
            <div className="omada-undo-emptyrow">{t('undo.empty')}</div>
          )}
          {rows.map((r) => (
            <div className="omada-undo-itemrow" role="listitem" key={r.id}>
              <span className="omada-undo-itemname">
                <Icon name="ap" size={16} />{r.name}
              </span>
              <Button size="small" type="text" danger
                      icon={<Icon name="trash" size={14} />}
                      onClick={() => deleteRow(r)}>
                {t('undo.delete')}
              </Button>
            </div>
          ))}
        </div>

        <div className="omada-undo-bartools">
          <Button onClick={archiveAll} disabled={!rows.length}
                  icon={<Icon name="inbox" size={15} />}>
            {t('undo.archiveall')}
          </Button>
          <Button onClick={stickyToast} icon={<Icon name="warning" size={15} />}>
            {t('undo.stickybtn')}
          </Button>
          <Button type="text" onClick={() => setRows(SEED)}
                  icon={<Icon name="refresh" size={15} />}>
            {t('undo.reset')}
          </Button>
        </div>

        <p className="omada-undo-hint">{t('undo.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.UndoToast = UndoToastDemo;
})();
