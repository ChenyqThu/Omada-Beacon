/* components/DataTable/DataTable.demo.jsx — Mounted by index.html. window.OmadaDemos.DataTable */
(function () {
  const { DataTable, StatusPill, Tooltip, Button } = window.Omada;
  const { Icon } = window.Omada;
  const { Switch, Dropdown, Empty, Space } = window.antd;
  const { useState, useMemo } = React;

  const TYPE_ICON = { gateway: 'gateway', switch: 'switch', ap: 'ap', camera: 'camera' };

  const ROWS = [
    { key: '1', name: 'Gateway-HQ',    type: 'gateway', ip: '192.168.0.1',  model: 'ER7206',     status: 'connected',    clients: 48, uptimeH: 342 },
    { key: '2', name: 'Core-SW-01',    type: 'switch',  ip: '192.168.0.2',  model: 'SG3428X',    status: 'connected',    clients: 0,  uptimeH: 1290 },
    { key: '3', name: 'AP-Lobby',      type: 'ap',      ip: '192.168.0.11', model: 'EAP670',     status: 'connected',    clients: 36, uptimeH: 168 },
    { key: '4', name: 'AP-Floor3-E',   type: 'ap',      ip: '192.168.0.14', model: 'EAP650',     status: 'adopting',     clients: 0,  uptimeH: 0 },
    { key: '5', name: 'Cam-Dock',      type: 'camera',  ip: '192.168.0.31', model: 'VIGI C540',  status: 'pending',      clients: 0,  uptimeH: 0 },
    { key: '6', name: 'AP-Warehouse',  type: 'ap',      ip: '192.168.0.18', model: 'EAP650',     status: 'disconnected', clients: 0,  uptimeH: 0 },
  ];

  function fmtUptime(h) {
    if (!h) return '—';
    const d = Math.floor(h / 24), r = h % 24;
    return d ? `${d}d ${r}h` : `${r}h`;
  }

  function DataTableDemo() {
    const { lang, t } = window.useOmada();
    const [dense, setDense] = useState(true);
    const [loading, setLoading] = useState(false);
    const [empty, setEmpty] = useState(false);
    const [selected, setSelected] = useState(['1', '3']);

    const rowMenu = (rec) => ({
      items: [
        { key: 'edit',   label: t('common.edit'),       icon: <Icon name="edit" size={16} /> },
        { key: 'move',   label: t('device.moveToSite'), icon: <Icon name="move-to-site" size={16} /> },
        { type: 'divider' },
        { key: 'forget', label: t('device.forget'),     icon: <Icon name="trash" size={16} />, danger: true },
      ],
    });

    const columns = useMemo(() => [
      {
        title: t('table.col.device'), dataIndex: 'name', key: 'name', fixed: 'left',
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (name, rec) => (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span style={{ display: 'inline-flex', color: 'var(--fg-tertiary,#999)' }}>
              <Icon name={TYPE_ICON[rec.type] || 'devices'} size={18} />
            </span>
            <span style={{ fontWeight: 500 }}>{name}</span>
          </span>
        ),
      },
      { title: t('table.col.ip'), dataIndex: 'ip', key: 'ip',
        render: (ip) => <span className="omada-mono">{ip}</span> },
      { title: t('table.col.model'), dataIndex: 'model', key: 'model' },
      { title: t('table.col.status'), dataIndex: 'status', key: 'status',
        filters: [
          { text: t('status.connected'), value: 'connected' },
          { text: t('status.adopting'), value: 'adopting' },
          { text: t('status.pending'), value: 'pending' },
          { text: t('status.disconnected'), value: 'disconnected' },
        ],
        onFilter: (v, rec) => rec.status === v,
        render: (s) => <StatusPill status={s} lang={lang} /> },
      { title: t('table.col.clients'), dataIndex: 'clients', key: 'clients', align: 'right',
        sorter: (a, b) => a.clients - b.clients,
        render: (c) => c ? c : <span style={{ color: 'var(--fg-quaternary,#CCC)' }}>—</span> },
      { title: t('table.col.uptime'), dataIndex: 'uptimeH', key: 'uptimeH', align: 'right',
        sorter: (a, b) => a.uptimeH - b.uptimeH,
        render: fmtUptime },
      {
        title: t('table.actions'), key: 'actions', align: 'right', width: 96,
        render: (_, rec) => (
          <span style={{ display: 'inline-flex', gap: 2, justifyContent: 'flex-end' }}>
            <Tooltip title={t('device.reboot')}>
              <Button variant="text" size="small" icon={<Icon name="reboot" size={16} />} />
            </Tooltip>
            <Dropdown menu={rowMenu(rec)} trigger={['click']} placement="bottomRight">
              <Button variant="text" size="small" icon={<Icon name="more-vertical" size={16} />} />
            </Dropdown>
          </span>
        ),
      },
    ], [lang, t]);

    const rowSelection = {
      selectedRowKeys: selected,
      onChange: setSelected,
    };

    const selBar = selected.length > 0 && !empty;

    return (
      <>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <Space size={20}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--fg-secondary,#636363)' }}>
              {t('table.dense')}
              <Switch size="small" checked={dense} onChange={setDense} />
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--fg-secondary,#636363)' }}>
              {t('common.loading')}
              <Switch size="small" checked={loading} onChange={setLoading} />
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--fg-secondary,#636363)' }}>
              Empty
              <Switch size="small" checked={empty} onChange={setEmpty} />
            </span>
          </Space>
        </div>

        <div style={{
          height: 36, display: 'flex', alignItems: 'center', gap: 14,
          opacity: selBar ? 1 : 0, transition: 'opacity 120ms',
          padding: '0 4px', marginBottom: 6,
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--omada-green-600,#009765)' }}>
            {t('table.selected').replace('{count}', selected.length)}
          </span>
          <Button variant="text" size="small" onClick={() => setSelected([])}>{t('table.clear')}</Button>
          <Button variant="danger-ghost" size="small" icon={<Icon name="trash" size={15} />}>{t('device.forget')}</Button>
        </div>

        <DataTable
          dense={dense}
          loading={loading}
          columns={columns}
          dataSource={empty ? [] : ROWS}
          rowSelection={rowSelection}
          pagination={false}
          scroll={{ x: 720 }}
        />
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.DataTable = DataTableDemo;
})();
