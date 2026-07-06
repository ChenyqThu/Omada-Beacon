/* components/BulkActions/BulkActions.demo.jsx — window.OmadaDemos.BulkActions */
(function () {
  const Icon = window.Omada.Icon;
  const StatusPill = window.Omada.StatusPill;
  const BulkActions = window.Omada.BulkActions;

  function BulkActionsDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;
    const msg = window.Omada.useMessage();

    const data = [
      { key: 'd1', name: 'AP-Lobby-01',  type: 'ap',      model: 'EAP670',  ip: '10.0.12.4',   status: 'connected',    clients: 48 },
      { key: 'd2', name: 'AP-Floor2-03', type: 'ap',      model: 'EAP650',  ip: '10.0.12.9',   status: 'connected',    clients: 31 },
      { key: 'd3', name: 'SW-Core-01',   type: 'switch',  model: 'SG3428X', ip: '10.0.12.1',   status: 'connected',    clients: 0 },
      { key: 'd4', name: 'GW-Edge-01',   type: 'gateway', model: 'ER8411',  ip: '10.0.12.254', status: 'pending',      clients: 0 },
      { key: 'd5', name: 'AP-Patio-02',  type: 'ap',      model: 'EAP610',  ip: '10.0.12.16',  status: 'disconnected', clients: 7 },
      { key: 'd6', name: 'AP-Cafe-02',   type: 'ap',      model: 'EAP610',  ip: '10.0.12.21',  status: 'connected',    clients: 12 },
    ];

    const columns = [
      { title: t('bulk.col.name'), dataIndex: 'name', key: 'name',
        render: function (v, r) {
          return (
            <span className="omada-bulk-dev">
              <span className="omada-bulk-devix"><Icon name={r.type} size={16} /></span>
              {v}
            </span>
          );
        } },
      { title: t('bulk.col.model'), dataIndex: 'model', key: 'model' },
      { title: t('bulk.col.ip'), dataIndex: 'ip', key: 'ip',
        render: function (v) { return <code className="omada-bulk-ip">{v}</code>; } },
      { title: t('bulk.col.status'), dataIndex: 'status', key: 'status',
        render: function (v) { return <StatusPill status={v} />; } },
      { title: t('bulk.col.clients'), dataIndex: 'clients', key: 'clients', align: 'right' },
    ];

    const run = function (label) {
      return function (keys, rows, clear) {
        msg.success(label + ' · ' + keys.length + ' ' + t('bulk.selected'));
        clear();
      };
    };

    const actions = [
      { key: 'reboot', icon: 'reboot',       label: t('device.reboot'),     onRun: run(t('device.reboot')) },
      { key: 'move',   icon: 'move-to-site', label: t('device.moveToSite'), onRun: run(t('device.moveToSite')) },
      { key: 'export', icon: 'export',       label: t('common.export'),     onRun: run(t('common.export')) },
      { key: 'forget', icon: 'trash',        label: t('device.forget'),     danger: true, onRun: run(t('device.forget')) },
    ];

    return (
      <BulkActions
        columns={columns}
        dataSource={data}
        rowKey="key"
        actions={actions}
        pagination={false}
        size="middle"
      />
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.BulkActions = BulkActionsDemo;
})();
