/* components/NetworkSelector/NetworkSelector.demo.jsx — window.OmadaDemos.NetworkSelector */
(function () {
  const NetworkSelector = window.Omada.NetworkSelector;

  const SITES = [
    { id: 'hq', name: 'HQ Campus', networks: [
      { id: 'corp', name: 'Corp-Main', vlan: 1 },
      { id: 'guest', name: 'Guest', vlan: 20 },
      { id: 'iot', name: 'IoT-Sensors', vlan: 40 },
    ] },
    { id: 'wh', name: 'Warehouse North', networks: [
      { id: 'ops', name: 'Ops-Floor', vlan: 1 },
      { id: 'cams', name: 'CCTV', vlan: 60 },
    ] },
    { id: 'br', name: 'Branch — Riverside', networks: [
      { id: 'office', name: 'Office', vlan: 1 },
      { id: 'pos', name: 'POS-Terminals', vlan: 30 },
      { id: 'guest2', name: 'Guest', vlan: 20 },
    ] },
  ];

  function NetworkSelectorDemo() {
    const { useState } = React;
    const ctx = window.useOmada();
    const t = ctx.t;
    const [value, setValue] = useState({ siteId: 'hq', netId: 'corp' });

    return (
      <div className="omada-nsl-demo">
        <NetworkSelector sites={SITES} value={value} onChange={setValue} />
        <p className="omada-nsl-pagehint">{t('nsl.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.NetworkSelector = NetworkSelectorDemo;
})();
