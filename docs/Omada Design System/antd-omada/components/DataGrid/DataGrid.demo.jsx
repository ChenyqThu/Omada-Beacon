/* components/DataGrid/DataGrid.demo.jsx — window.OmadaDemos.DataGrid */
(function () {
  const { useState } = React;
  const DataGrid = window.Omada.DataGrid;
  const Icon = window.Omada.Icon;

  function DataGridDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;

    const columns = [
      { key: 'name', title: t('dg.c.name'), type: 'text', width: '22%',
        validate: function (v) { return (!v || !String(v).trim()) ? t('dg.v.required') : ''; } },
      { key: 'model', title: t('dg.c.model'), type: 'text', editable: false, width: '18%' },
      { key: 'ip', title: t('dg.c.ip'), type: 'text', width: '20%',
        validate: function (v) {
          return /^(\d{1,3}\.){3}\d{1,3}$/.test(String(v || '')) ? '' : t('dg.v.ip');
        } },
      { key: 'vlan', title: t('dg.c.vlan'), type: 'number', align: 'right', width: '12%',
        validate: function (v) { return (v >= 1 && v <= 4094) ? '' : t('dg.v.vlan'); } },
      { key: 'role', title: t('dg.c.role'), type: 'enum', width: '16%', options: [
        { label: t('dg.o.access'), value: 'access' },
        { label: t('dg.o.trunk'), value: 'trunk' },
        { label: t('dg.o.mirror'), value: 'mirror' },
      ] },
      { key: 'poe', title: t('dg.c.poe'), type: 'toggle', align: 'right', width: '12%' },
    ];

    const [rows, setRows] = useState([
      { key: 'p1', name: 'Lobby AP', model: 'EAP670', ip: '192.168.1.21', vlan: 10, role: 'access', poe: true },
      { key: 'p2', name: 'Core Switch', model: 'TL-SG3428', ip: '192.168.1.2', vlan: 1, role: 'trunk', poe: false },
      { key: 'p3', name: 'Gateway', model: 'ER7206', ip: '192.168.1.1', vlan: 1, role: 'trunk', poe: false },
      { key: 'p4', name: 'Warehouse AP', model: 'EAP650', ip: '192.168.1.34', vlan: 20, role: 'access', poe: true },
      { key: 'p5', name: 'Camera Uplink', model: 'TL-SG2210', ip: '192.168.1.40', vlan: 30, role: 'mirror', poe: true },
    ]);

    return (
      <div className="omada-dg-demo">
        <div className="omada-dg-hint">
          <Icon name="edit" size={13} />{t('dg.hint')}
        </div>
        <DataGrid
          columns={columns}
          rows={rows}
          rowKey="key"
          onChange={function (next) { setRows(next); }}
          onSave={function () { /* a backend PATCH would fire here */ }}
        />
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.DataGrid = DataGridDemo;
})();
