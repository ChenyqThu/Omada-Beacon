/* components/Tabs/Tabs.demo.jsx — Mounted by index.html. window.OmadaDemos.Tabs */
(function () {
  const { Tabs, Icon } = window.Omada;

  function TabsDemo() {
    const { t, lang } = window.useOmada();

    const labeled = (icon, key) => ({
      key,
      label: <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <Icon name={icon} size={16} />{t(key)}
      </span>,
    });

    const lineItems = [
      labeled('dashboard', 'tab.overview'),
      labeled('map', 'tab.topology'),
      labeled('insights', 'tab.statistics'),
      { ...labeled('clients', 'tab.clients') },
      { key: 'tab.config', label: t('tab.config'), disabled: true },
    ];

    const cardItems = [
      { key: 'tab.overview', label: t('tab.overview') },
      { key: 'tab.ports',    label: t('tab.ports') },
      { key: 'tab.config',   label: t('tab.config') },
      { key: 'tab.log',      label: t('tab.log') },
    ];

    // editable-card (device tabs)
    const [panes, setPanes] = React.useState([
      { key: '1', label: 'SG2428P-01' },
      { key: '2', label: 'EAP670-Lobby' },
      { key: '3', label: 'ER7206-GW' },
    ]);
    const [active, setActive] = React.useState('1');
    const nextKey = React.useRef(4);
    const onEdit = (targetKey, action) => {
      if (action === 'add') {
        const k = String(nextKey.current++);
        setPanes((p) => [...p, { key: k, label: 'Device-' + k }]);
        setActive(k);
      } else {
        setPanes((p) => {
          const left = p.filter((x) => x.key !== targetKey);
          if (targetKey === active && left.length) setActive(left[0].key);
          return left;
        });
      }
    };

    return (
      <>
        <div className="row"><span className="label">line</span></div>
        <Tabs variant="line" defaultActiveKey="tab.overview" items={lineItems}
              style={{ maxWidth: 560 }} />

        <div className="row" style={{ marginTop: 18 }}><span className="label">line · lg</span></div>
        <Tabs variant="line" size="large" defaultActiveKey="tab.overview"
              items={[labeled('dashboard','tab.overview'), labeled('map','tab.topology'), labeled('insights','tab.statistics')]}
              style={{ maxWidth: 480 }} />

        <div className="row" style={{ marginTop: 18 }}><span className="label">card</span></div>
        <Tabs variant="card" defaultActiveKey="tab.overview" items={cardItems} style={{ maxWidth: 480 }} />

        <div className="row" style={{ marginTop: 18 }}><span className="label">editable</span></div>
        <Tabs
          variant="editable-card"
          activeKey={active}
          onChange={setActive}
          onEdit={onEdit}
          items={panes.map((p) => ({ ...p, label:
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="switch" size={15} />{p.label}</span> }))}
          style={{ maxWidth: 620 }}
        />

        <div className="row" style={{ marginTop: 18 }}><span className="label">centered</span></div>
        <Tabs variant="line" centered defaultActiveKey="tab.overview"
              items={[{key:'tab.overview',label:t('tab.overview')},{key:'tab.clients',label:t('tab.clients')},{key:'tab.details',label:t('tab.details')}]}
              style={{ maxWidth: 480 }} />
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Tabs = TabsDemo;
})();
