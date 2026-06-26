/* components/DiffView/DiffView.demo.jsx — window.OmadaDemos.DiffView */
(function () {
  const DiffView = window.Omada.DiffView;

  function DiffViewDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;

    const items = [
      { key: 'ssid', group: t('diff.g.wireless'), label: t('diff.f.ssid'), before: 'Omada-Office', after: 'Omada-HQ' },
      { key: 'band', group: t('diff.g.wireless'), label: t('diff.f.band'), before: '2.4 + 5 GHz', after: '2.4 + 5 GHz' },
      { key: 'security', group: t('diff.g.wireless'), label: t('diff.f.security'), before: 'WPA2', after: 'WPA3' },
      { key: 'guest', group: t('diff.g.wireless'), label: t('diff.f.guest'), before: '', after: 'Omada-Guest' },
      { key: 'vlan', group: t('diff.g.network'), label: t('diff.f.vlan'), before: 1, after: 20 },
      { key: 'dhcp', group: t('diff.g.network'), label: t('diff.f.dhcp'), before: 'on', after: 'on' },
      { key: 'legacyRate', group: t('diff.g.network'), label: t('diff.f.legacyRate'), before: 'enabled', after: '' },
      { key: 'igmp', group: t('diff.g.network'), label: t('diff.f.igmp'), before: false, after: true },
    ];

    return (
      <div className="omada-diff-demo">
        <DiffView
          items={items}
          beforeLabel={t('diff.current')}
          afterLabel={t('diff.pending')}
        />
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.DiffView = DiffViewDemo;
})();
