/* components/PortPanel/PortPanel.demo.jsx — window.OmadaDemos.PortPanel */
(function () {
  const PortPanel = window.Omada.PortPanel;

  function PortPanelDemo() {
    const { useMemo } = React;
    const ctx = window.useOmada();
    const t = ctx.t;

    const access = useMemo(() => {
      const mk = (id, status, extra) => Object.assign({ id, status }, extra);
      return [
        mk(1, 'up', { speed: '1 Gbps', vlan: 1, poe: 6.2, name: 'AP-Lobby', tx: '12.4 Mbps', rx: '3.1 Mbps' }),
        mk(2, 'up', { speed: '1 Gbps', vlan: 1, poe: 4.8, name: 'AP-Cafe', tx: '8.2 Mbps', rx: '1.9 Mbps' }),
        mk(3, 'up', { speed: '100 Mbps', vlan: 20, name: 'Printer-2F', tx: '0.1 Mbps', rx: '0.4 Mbps' }),
        mk(4, 'down', {}),
        mk(5, 'up', { speed: '1 Gbps', vlan: 30, poe: 12.5, name: 'CAM-Door', tx: '6.5 Mbps', rx: '0.2 Mbps' }),
        mk(6, 'down', {}),
        mk(7, 'error', { name: 'Loop detected', vlan: 1 }),
        mk(8, 'down', {}),
        mk(9, 'up', { speed: '1 Gbps', vlan: 10, name: 'NAS', tx: '88 Mbps', rx: '102 Mbps' }),
        mk(10, 'down', {}),
        mk(11, 'disabled', {}),
        mk(12, 'disabled', {}),
        mk(13, 'up', { speed: '1 Gbps', vlan: 1, poe: 5.1, name: 'AP-3F', tx: '14 Mbps', rx: '2.2 Mbps' }),
        mk(14, 'down', {}),
        mk(15, 'down', {}),
        mk(16, 'up', { speed: '1 Gbps', vlan: 40, name: 'Door-Ctrl', tx: '0.2 Mbps', rx: '0.1 Mbps' }),
        mk(17, 'down', {}), mk(18, 'down', {}), mk(19, 'down', {}), mk(20, 'down', {}),
        mk(21, 'down', {}), mk(22, 'down', {}), mk(23, 'down', {}),
        mk(24, 'up', { speed: '1 Gbps', vlan: 1, uplink: true, name: 'To-Core', tx: '240 Mbps', rx: '310 Mbps' }),
        mk(25, 'up', { media: 'sfp', speed: '10 Gbps', uplink: true, name: 'Fiber-A', tx: '1.2 Gbps', rx: '0.9 Gbps' }),
        mk(26, 'down', { media: 'sfp' }),
        mk(27, 'down', { media: 'sfp' }),
        mk(28, 'up', { media: 'sfp', speed: '10 Gbps', uplink: true, name: 'Fiber-B', tx: '0.8 Gbps', rx: '1.1 Gbps' }),
      ];
    }, []);

    const compact = useMemo(() => ([
      { id: 1, status: 'up', speed: '1 Gbps', poe: 3.9, vlan: 1 },
      { id: 2, status: 'up', speed: '1 Gbps', poe: 7.4, vlan: 1 },
      { id: 3, status: 'down' },
      { id: 4, status: 'down' },
      { id: 5, status: 'up', speed: '1 Gbps', vlan: 10 },
      { id: 6, status: 'down' },
      { id: 7, status: 'down' },
      { id: 8, status: 'up', speed: '1 Gbps', uplink: true, vlan: 1 },
    ]), []);

    return (
      <div className="omada-portp-demo">
        <div className="omada-portp-block">
          <div className="omada-portp-blocktitle">{t('portp.b.access')}</div>
          <PortPanel ports={access} label="SG3428XPP-M2" />
        </div>
        <div className="omada-portp-block">
          <div className="omada-portp-blocktitle">{t('portp.b.compact')}</div>
          <PortPanel ports={compact} label="SG2008P" legend={false} />
        </div>
        <p className="omada-portp-pagehint">{t('portp.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.PortPanel = PortPanelDemo;
})();
