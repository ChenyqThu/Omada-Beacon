/* components/VlanMatrix/VlanMatrix.demo.jsx — window.OmadaDemos.VlanMatrix */
(function () {
  const VlanMatrix = window.Omada.VlanMatrix;

  const VLANS = [
    { id: 1, name: 'Default' },
    { id: 10, name: 'Office' },
    { id: 20, name: 'IoT' },
    { id: 30, name: 'Guest' },
    { id: 99, name: 'Mgmt' },
  ];

  const DEFAULT = {
    1:  { 1: 'u', 2: 'u', 3: 'u', 4: 'u', 13: 'u', 14: 'u' },
    10: { 5: 'u', 6: 'u', 7: 'u', 8: 'u', 15: 't', 16: 't' },
    20: { 9: 'u', 10: 'u', 15: 't', 16: 't' },
    30: { 11: 'u', 12: 'u', 15: 't', 16: 't' },
    99: { 15: 'u', 16: 'u' },
  };

  function VlanMatrixDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;
    return (
      <div className="omada-b27-demo">
        <div className="omada-b27-blocktitle">{t('vlanm.b.switch')}</div>
        <VlanMatrix ports={16} vlans={VLANS} defaultValue={DEFAULT} />
        <p className="omada-b27-pagehint">{t('vlanm.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.VlanMatrix = VlanMatrixDemo;
})();
