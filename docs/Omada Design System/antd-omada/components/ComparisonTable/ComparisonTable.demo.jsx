/* components/ComparisonTable/ComparisonTable.demo.jsx — window.OmadaDemos.ComparisonTable */
(function () {
  const ComparisonTable = window.Omada.ComparisonTable;

  function ComparisonTableDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;

    // ── product comparison ──
    const columns = [
      { key: 'er605',   label: 'ER605',    sublabel: t('cmp.gw.soho'),  icon: 'gateway', price: '$69',
        values: { ports: '5×', wan: '1', vpn: 20, throughput: 940, vlan: true, sdn: true, sfp: false, poe: false, warranty: 5 } },
      { key: 'er7212',  label: 'ER7212PC', sublabel: t('cmp.gw.smb'),   icon: 'gateway', price: '$199', highlight: true,
        values: { ports: '8×', wan: '2', vpn: 100, throughput: 1500, vlan: true, sdn: true, sfp: true, poe: true, warranty: 5 } },
      { key: 'er8411',  label: 'ER8411',   sublabel: t('cmp.gw.ent'),   icon: 'gateway', price: '$499',
        values: { ports: '10×', wan: '4', vpn: 200, throughput: 10000, vlan: true, sdn: true, sfp: true, poe: false, warranty: 5 } },
    ];

    const attributes = [
      { group: t('cmp.grp.hardware'), key: 'ports', label: t('cmp.attr.ports') },
      { group: t('cmp.grp.hardware'), key: 'wan',   label: t('cmp.attr.wan') },
      { group: t('cmp.grp.hardware'), key: 'sfp',   label: t('cmp.attr.sfp'), type: 'bool' },
      { group: t('cmp.grp.hardware'), key: 'poe',   label: t('cmp.attr.poe'), type: 'bool' },
      { group: t('cmp.grp.perf'), key: 'throughput', label: t('cmp.attr.throughput'), unit: ' Mbps' },
      { group: t('cmp.grp.perf'), key: 'vpn',        label: t('cmp.attr.vpn') },
      { group: t('cmp.grp.soft'), key: 'vlan', label: t('cmp.attr.vlan'), type: 'bool' },
      { group: t('cmp.grp.soft'), key: 'sdn',  label: t('cmp.attr.sdn'), type: 'bool' },
      { group: t('cmp.grp.soft'), key: 'warranty', label: t('cmp.attr.warranty'), unit: ' ' + t('cmp.years') },
    ];

    return (
      <div className="omada-cmp-demo">
        <ComparisonTable
          title={t('cmp.demo.title')}
          attributeLabel={t('cmp.demo.feature')}
          attributes={attributes}
          columns={columns}
        />
        <p className="omada-cmp-pagehint">{t('cmp.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.ComparisonTable = ComparisonTableDemo;
})();
