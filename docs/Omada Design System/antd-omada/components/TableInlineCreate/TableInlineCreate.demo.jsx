/* components/TableInlineCreate/TableInlineCreate.demo.jsx — window.OmadaDemos.TableInlineCreate */
(function () {
  const TableInlineCreate = window.Omada.TableInlineCreate;
  const Button = window.Omada.Button;
  const Icon = window.Omada.Icon;
  const { App, Switch } = window.antd;

  function TableInlineCreateDemo() {
    const { useState } = React;
    const ctx = window.useOmada();
    const t = ctx.t;
    const appApi = App.useApp ? App.useApp() : null;
    const msg = appApi && appApi.message ? appApi.message : { success: () => {} };

    const protoOpts = [
      { value: 'tcp', label: 'TCP' },
      { value: 'udp', label: 'UDP' },
      { value: 'both', label: 'TCP/UDP' },
    ];

    const columns = [
      { key: 'name', title: t('tic.col.name'), type: 'text', required: true, placeholder: t('tic.ph.name') },
      { key: 'ext',  title: t('tic.col.ext'),  type: 'number', required: true, min: 1, max: 65535, width: 110, align: 'end' },
      { key: 'int',  title: t('tic.col.int'),  type: 'number', required: true, min: 1, max: 65535, width: 110, align: 'end' },
      { key: 'proto', title: t('tic.col.proto'), type: 'select', required: true, options: protoOpts, width: 130,
        render: (v) => { const o = protoOpts.find((x) => x.value === v); return o ? o.label : v; } },
    ];

    const [rows, setRows] = useState([
      { id: 'p1', name: 'Web server',  ext: 443,  int: 443,  proto: 'tcp' },
      { id: 'p2', name: 'Game console', ext: 3074, int: 3074, proto: 'both' },
    ]);

    const [keepOpen, setKeepOpen] = useState(false);

    return (
      <div className="omada-tic-demo">
        <div className="omada-tic-democard">
          <div className="omada-tic-demohead">
            <span className="omada-tic-demotitle">{t('tic.demo.title')}</span>
            <label className="omada-tic-demotoggle">
              <Switch size="small" checked={keepOpen} onChange={setKeepOpen} />
              {t('tic.keepopen')}
            </label>
          </div>

          <TableInlineCreate
            columns={columns}
            value={rows}
            onChange={setRows}
            keepOpen={keepOpen}
            addLabel={t('tic.addrule')}
            emptyText={t('tic.demo.empty')}
            onCreate={(r) => msg.success(t('tic.created').replace('{name}', r.name))}
          />

          <div className="omada-tic-demofoot">
            <span className="omada-tic-democount">
              {t('tic.demo.count').replace('{n}', rows.length)}
            </span>
            <Button variant="text" size="small" icon={<Icon name="refresh" size={14} />}
                    onClick={() => setRows([])}>
              {t('tic.clearall')}
            </Button>
          </div>
        </div>

        <p className="omada-tic-pagehint">{t('tic.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.TableInlineCreate = TableInlineCreateDemo;
})();
