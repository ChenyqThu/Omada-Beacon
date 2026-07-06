/* components/DataExport/DataExport.demo.jsx — window.OmadaDemos.DataExport */
(function () {
  const Icon = window.Omada.Icon;
  const DataExport = window.Omada.DataExport;
  const StatusPill = window.Omada.StatusPill;

  function DataExportDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;

    const columns = [
      { title: t('dxp.c.name'),   dataIndex: 'name',   key: 'name',
        render: (v) => <span className="omada-dxp-dev"><Icon name="ap" size={15} />{v}</span> },
      { title: t('dxp.c.model'),  dataIndex: 'model',  key: 'model' },
      { title: t('dxp.c.ip'),     dataIndex: 'ip',     key: 'ip',
        render: (v) => <code className="omada-dxp-ip">{v}</code> },
      { title: t('dxp.c.clients'), dataIndex: 'clients', key: 'clients', align: 'right' },
      { title: t('dxp.c.status'), dataIndex: 'status', key: 'status',
        render: (v) => (StatusPill ? <StatusPill status={v} /> : v) },
    ];

    const data = [
      { key: '1', name: 'AP-Lobby-01',   model: 'EAP670',  ip: '10.0.12.4',  clients: 48, status: 'connected' },
      { key: '2', name: 'AP-Floor2-03',  model: 'EAP650',  ip: '10.0.12.9',  clients: 31, status: 'connected' },
      { key: '3', name: 'SW-Core-01',    model: 'SG3428X', ip: '10.0.12.1',  clients: 0,  status: 'connected' },
      { key: '4', name: 'GW-Edge-01',    model: 'ER8411',  ip: '10.0.12.254', clients: 0, status: 'pending' },
      { key: '5', name: 'AP-Patio-02',   model: 'EAP610',  ip: '10.0.12.16', clients: 7,  status: 'disconnected' },
    ];

    return (
      <DataExport columns={columns} data={data} filename="omada-devices" />
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.DataExport = DataExportDemo;
})();
