/* components/TopologyMap/TopologyMap.demo.jsx — window.OmadaDemos.TopologyMap */
(function () {
  const TopologyMap = window.Omada.TopologyMap;
  const Icon = window.Omada.Icon;

  function TopologyMapDemo() {
    const { useState } = React;
    const ctx = window.useOmada();
    const t = ctx.t;
    const [sel, setSel] = useState('gw');

    const nodes = [
      { id: 'cloud', type: 'cloud', label: t('topo.n.cloud'), x: 0.5, y: 0.08, status: 'up' },
      { id: 'gw', type: 'gateway', label: 'GW-HQ-01', x: 0.5, y: 0.32, status: 'up' },
      { id: 'sw1', type: 'switch', label: 'SW-Core-01', x: 0.24, y: 0.58, status: 'up' },
      { id: 'sw2', type: 'switch', label: 'SW-Edge-12', x: 0.76, y: 0.58, status: 'degraded' },
      { id: 'ap1', type: 'ap', label: 'AP-Lobby-03', x: 0.1, y: 0.88, status: 'up' },
      { id: 'ap2', type: 'ap', label: 'AP-Office-21', x: 0.38, y: 0.88, status: 'up' },
      { id: 'ap3', type: 'ap', label: 'AP-Whse-07', x: 0.64, y: 0.88, status: 'down' },
      { id: 'cam', type: 'camera', label: 'CAM-Dock-02', x: 0.9, y: 0.88, status: 'idle' },
    ];

    const links = [
      { from: 'cloud', to: 'gw', status: 'up' },
      { from: 'gw', to: 'sw1', status: 'up' },
      { from: 'gw', to: 'sw2', status: 'degraded' },
      { from: 'sw1', to: 'ap1', status: 'up' },
      { from: 'sw1', to: 'ap2', status: 'up' },
      { from: 'sw2', to: 'ap3', status: 'down' },
      { from: 'sw2', to: 'cam', status: 'idle' },
    ];

    const node = nodes.find((n) => n.id === sel);

    return (
      <div className="omada-topo-demo">
        <TopologyMap nodes={nodes} links={links} selected={sel} onSelect={(n) => setSel(n ? n.id : null)} />
        <div className="omada-topo-detail">
          {node ? (
            <React.Fragment>
              <span className={'omada-topo-detailic is-' + node.status}><Icon name={node.type} size={20} /></span>
              <div className="omada-topo-detailbody">
                <div className="omada-topo-detailname">{node.label}</div>
                <div className="omada-topo-detailmeta">{t('topo.s.' + node.status)} · {t('topo.uplinks')}: {links.filter((l) => l.from === node.id || l.to === node.id).length}</div>
              </div>
            </React.Fragment>
          ) : (
            <span className="omada-topo-detailhint">{t('topo.selecthint')}</span>
          )}
        </div>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.TopologyMap = TopologyMapDemo;
})();
