/* components/DataExplorer/DataExplorer.demo.jsx — window.OmadaDemos.DataExplorer */
(function () {
  const DataExplorer = window.Omada.DataExplorer;
  const StatusPill = window.Omada.StatusPill;
  const Icon = window.Omada.Icon;

  function DataExplorerDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;

    const TYPE_ICON = { gateway: 'gateway', switch: 'switch', ap: 'ap', camera: 'camera' };
    const STATUS_TONE = { connected: 'connected', pending: 'pending', disconnected: 'disconnected' };

    const rows = [
      { key: 'd1', name: 'GW-HQ-01', type: 'gateway', status: 'connected', site: 'HQ', clients: 412, ip: '10.0.0.1', fw: '1.2.7' },
      { key: 'd2', name: 'SW-Core-01', type: 'switch', status: 'connected', site: 'HQ', clients: 0, ip: '10.0.0.2', fw: '2.4.1' },
      { key: 'd3', name: 'AP-Lobby-03', type: 'ap', status: 'connected', site: 'HQ', clients: 86, ip: '10.0.1.14', fw: '5.1.0' },
      { key: 'd4', name: 'AP-Whse-07', type: 'ap', status: 'disconnected', site: 'Warehouse', clients: 0, ip: '10.0.3.7', fw: '5.0.9' },
      { key: 'd5', name: 'CAM-Dock-02', type: 'camera', status: 'connected', site: 'Warehouse', clients: 0, ip: '10.0.4.2', fw: '3.3.2' },
      { key: 'd6', name: 'SW-Edge-12', type: 'switch', status: 'pending', site: 'Branch A', clients: 0, ip: '10.1.0.12', fw: '2.4.0' },
      { key: 'd7', name: 'AP-Office-21', type: 'ap', status: 'connected', site: 'Branch A', clients: 54, ip: '10.1.1.21', fw: '5.1.0' },
      { key: 'd8', name: 'GW-BranchB', type: 'gateway', status: 'pending', site: 'Branch B', clients: 0, ip: '10.2.0.1', fw: '1.2.6' },
      { key: 'd9', name: 'CAM-Gate-01', type: 'camera', status: 'disconnected', site: 'Branch B', clients: 0, ip: '10.2.4.1', fw: '3.3.0' },
    ];

    const facets = [
      { key: 'type', label: t('dx.f.type'), options: [
        { value: 'gateway', label: t('dx.t.gateway'), count: 2 },
        { value: 'switch', label: t('dx.t.switch'), count: 2 },
        { value: 'ap', label: t('dx.t.ap'), count: 3 },
        { value: 'camera', label: t('dx.t.camera'), count: 2 },
      ] },
      { key: 'status', label: t('dx.f.status'), options: [
        { value: 'connected', label: t('status.connected'), count: 5 },
        { value: 'pending', label: t('status.pending'), count: 2 },
        { value: 'disconnected', label: t('status.disconnected'), count: 2 },
      ] },
      { key: 'site', label: t('dx.f.site'), options: [
        { value: 'HQ', label: 'HQ', count: 3 },
        { value: 'Warehouse', label: t('dx.s.warehouse'), count: 2 },
        { value: 'Branch A', label: t('dx.s.branchA'), count: 2 },
        { value: 'Branch B', label: t('dx.s.branchB'), count: 2 },
      ] },
    ];

    const columns = [
      { key: 'name', dataIndex: 'name', title: t('dx.c.device'),
        render: (v, r) => <span className="omada-dx-cellname"><Icon name={TYPE_ICON[r.type]} size={16} />{v}</span> },
      { key: 'status', dataIndex: 'status', title: t('dx.c.status'),
        render: (v) => <StatusPill status={STATUS_TONE[v]} /> },
      { key: 'site', dataIndex: 'site', title: t('dx.c.site') },
      { key: 'clients', dataIndex: 'clients', title: t('dx.c.clients'), align: 'right' },
    ];

    const renderPreview = (r) => (
      <div className="omada-dx-card">
        <div className="omada-dx-cardtop">
          <span className={'omada-dx-cardic is-' + (r.status === 'connected' ? 'brand' : r.status === 'pending' ? 'orange' : 'red')}>
            <Icon name={TYPE_ICON[r.type]} size={22} />
          </span>
          <div>
            <div className="omada-dx-cardname">{r.name}</div>
            <StatusPill status={STATUS_TONE[r.status]} />
          </div>
        </div>
        <dl className="omada-dx-kv">
          <div className="omada-dx-kvrow"><dt>{t('dx.c.site')}</dt><dd>{r.site}</dd></div>
          <div className="omada-dx-kvrow"><dt>IP</dt><dd className="omada-dx-mono">{r.ip}</dd></div>
          <div className="omada-dx-kvrow"><dt>{t('dx.c.clients')}</dt><dd>{r.clients}</dd></div>
          <div className="omada-dx-kvrow"><dt>{t('dx.fw')}</dt><dd className="omada-dx-mono">{r.fw}</dd></div>
        </dl>
      </div>
    );

    return (
      <div className="omada-dx-demo">
        <DataExplorer
          facets={facets}
          columns={columns}
          rows={rows}
          renderPreview={renderPreview}
          previewTitle={(r) => r.name}
        />
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.DataExplorer = DataExplorerDemo;
})();
