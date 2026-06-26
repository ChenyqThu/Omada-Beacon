/* components/RowSelection/RowSelection.demo.jsx — window.OmadaDemos.RowSelection */
(function () {
  const RowSelection = window.Omada.RowSelection;
  const StatusPill = window.Omada.StatusPill;

  function RowSelectionDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;
    const { App } = window.antd;
    const appApi = App.useApp ? App.useApp() : null;
    const msg = appApi && appApi.message ? appApi.message : { success: () => {}, info: () => {} };

    const data = [
      { key: 'd1', name: 'AP-Lobby-01', ip: '10.0.12.4', model: 'EAP670', status: 'connected' },
      { key: 'd2', name: 'AP-Floor2-03', ip: '10.0.12.7', model: 'EAP650', status: 'connected' },
      { key: 'd3', name: 'SW-Core-01', ip: '10.0.12.2', model: 'SG3428', status: 'pending' },
      { key: 'd4', name: 'SW-Edge-04', ip: '10.0.12.9', model: 'SG2210', status: 'connected' },
      { key: 'd5', name: 'GW-Main', ip: '10.0.12.1', model: 'ER7212', status: 'disconnected' },
      { key: 'd6', name: 'AP-Cafe-02', ip: '10.0.12.14', model: 'EAP610', status: 'connected' },
    ];

    const columns = [
      { title: t('rs.col.device'), dataIndex: 'name', render: (v) => <span style={{ fontWeight: 600 }}>{v}</span> },
      { title: t('rs.col.ip'), dataIndex: 'ip', render: (v) => <span style={{ fontFamily: 'var(--font-mono)' }}>{v}</span> },
      { title: t('rs.col.model'), dataIndex: 'model' },
      { title: t('rs.col.status'), dataIndex: 'status', width: 130,
        render: (s) => <StatusPill status={s} /> },
    ];

    const bulk = [
      { key: 'reboot', label: t('rs.reboot'), icon: 'reboot', onClick: (k) => msg.info(t('rs.reboot') + ' · ' + k.length) },
      { key: 'move', label: t('rs.move'), icon: 'map', onClick: (k) => msg.info(t('rs.move') + ' · ' + k.length) },
      { key: 'forget', label: t('rs.forget'), icon: 'trash', danger: true, onClick: (k) => msg.success(t('rs.forget') + ' · ' + k.length) },
    ];

    return (
      <RowSelection columns={columns} dataSource={data} rowKey="key"
                    defaultSelectedKeys={['d2', 'd4']} bulkActions={bulk} />
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.RowSelection = RowSelectionDemo;
})();
