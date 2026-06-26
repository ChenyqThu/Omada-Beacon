/* components/Collapse/Collapse.demo.jsx — window.OmadaDemos.Collapse */
(function () {
  const { Collapse, Icon } = window.Omada;

  function CollapseDemo() {
    const { t } = window.useOmada();

    // header with a trailing green status (matches the Figma right-edge text)
    const headerWithStatus = (titleKey, statusKey) => (
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1, gap: 12 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          {t(titleKey)}
          <Icon name="info" size={16} style={{ color: 'var(--fg-tertiary,#999)' }} />
        </span>
        {statusKey && <span className="omada-collapse-status">{t(statusKey)}</span>}
      </span>
    );

    const items = [
      { key: '1', label: headerWithStatus('collapse.licenseTitle', 'collapse.status.on'),
        children: <span style={{ fontSize: 14 }}>{t('collapse.licenseBody')}</span> },
      { key: '2', label: headerWithStatus('collapse.adoptTitle'),
        children: <span style={{ fontSize: 14 }}>{t('collapse.adoptBody')}</span> },
      { key: '3', label: headerWithStatus('collapse.firmwareTitle'),
        children: <span style={{ fontSize: 14 }}>{t('collapse.firmwareBody')}</span> },
    ];

    const ghostItems = [
      { key: '1', label: t('collapse.adoptTitle'), children: <span style={{ fontSize: 14 }}>{t('collapse.adoptBody')}</span> },
      { key: '2', label: t('collapse.firmwareTitle'), children: <span style={{ fontSize: 14 }}>{t('collapse.firmwareBody')}</span> },
    ];

    return (
      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div>
          <div className="row"><span className="label">card</span></div>
          <Collapse defaultActiveKey={['1']} accordion items={items} />
        </div>
        <div>
          <div className="row"><span className="label">{t('collapse.ghost')}</span></div>
          <Collapse variant="ghost" defaultActiveKey={['1']} items={ghostItems} />
        </div>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Collapse = CollapseDemo;
})();
