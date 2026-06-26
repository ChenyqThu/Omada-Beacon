/* components/Workspace/Workspace.demo.jsx — window.OmadaDemos.Workspace */
(function () {
  const { Descriptions, Switch, Slider, Form } = window.antd;
  const Icon = window.Omada.Icon;
  const StatusPill = window.Omada.StatusPill;
  const Workspace = window.Omada.Workspace;

  function WorkspaceDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;

    const devices = [
      { key: 'd1', name: 'AP-Lobby-01',  type: 'ap',      model: 'EAP670',  status: 'connected',    ip: '10.0.12.4',   clients: 48, uptime: '21d 4h',  band: 80 },
      { key: 'd2', name: 'AP-Floor2-03', type: 'ap',      model: 'EAP650',  status: 'connected',    ip: '10.0.12.9',   clients: 31, uptime: '12d 9h',  band: 60 },
      { key: 'd3', name: 'SW-Core-01',   type: 'switch',  model: 'SG3428X', status: 'connected',    ip: '10.0.12.1',   clients: 0,  uptime: '64d 2h',  band: 0 },
      { key: 'd4', name: 'GW-Edge-01',   type: 'gateway', model: 'ER8411',  status: 'pending',      ip: '10.0.12.254', clients: 0,  uptime: '—',       band: 0 },
      { key: 'd5', name: 'AP-Patio-02',  type: 'ap',      model: 'EAP610',  status: 'disconnected', ip: '10.0.12.16',  clients: 7,  uptime: '0',       band: 40 },
    ];

    return (
      <Workspace
        items={devices}
        renderRow={(d) => (
          <span className="omada-ws-dev">
            <span className="omada-ws-devix"><Icon name={d.type} size={18} /></span>
            <span className="omada-ws-devtxt">
              <span className="omada-ws-devname">{d.name}</span>
              <span className="omada-ws-devmodel">{d.model}</span>
            </span>
            <span className={'omada-ws-statusdot tone-' + d.status} aria-label={d.status} />
          </span>
        )}
        renderDetail={(d) => d && (
          <div className="omada-ws-detail">
            <div className="omada-ws-detailtop">
              <span className="omada-ws-detailix"><Icon name={d.type} size={22} /></span>
              <div>
                <div className="omada-ws-detailname">{d.name}</div>
                <div className="omada-ws-detailsub">{d.model} · {d.ip}</div>
              </div>
              <StatusPill status={d.status} />
            </div>
            <div className="omada-ws-stats">
              <div className="omada-ws-stat"><div className="omada-ws-statn">{d.clients}</div><div className="omada-ws-statl">{t('ws.clients')}</div></div>
              <div className="omada-ws-stat"><div className="omada-ws-statn">{d.uptime}</div><div className="omada-ws-statl">{t('ws.uptime')}</div></div>
              <div className="omada-ws-stat"><div className="omada-ws-statn">{d.band}%</div><div className="omada-ws-statl">{t('ws.load')}</div></div>
            </div>
            <Descriptions bordered size="small" column={1} className="omada-ws-desc">
              <Descriptions.Item label={t('ws.f.model')}>{d.model}</Descriptions.Item>
              <Descriptions.Item label={t('ws.f.ip')}><code>{d.ip}</code></Descriptions.Item>
              <Descriptions.Item label={t('ws.f.type')}>{t('ws.t.' + d.type)}</Descriptions.Item>
              <Descriptions.Item label={t('ws.f.uptime')}>{d.uptime}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
        renderInspector={(d) => d && (
          <Form layout="vertical" className="omada-ws-inspform">
            <Form.Item label={t('ws.i.led')}>
              <Switch defaultChecked size="small" />
            </Form.Item>
            <Form.Item label={t('ws.i.band')}>
              <Slider defaultValue={d.band} />
            </Form.Item>
            <Form.Item label={t('ws.i.meshing')}>
              <Switch defaultChecked={d.type === 'ap'} size="small" />
            </Form.Item>
            <div className="omada-ws-inspnote">
              <Icon name="info" size={14} />
              <span>{t('ws.inspNote')}</span>
            </div>
          </Form>
        )}
      />
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Workspace = WorkspaceDemo;
})();
