/* components/Descriptions/Descriptions.demo.jsx — Mounted by index.html. window.OmadaDemos.Descriptions */
(function () {
  const { Descriptions, StatusPill } = window.Omada;
  const { Item } = Descriptions;

  function DescriptionsDemo() {
    const { lang, t } = window.useOmada();
    const facts = [
      [t('desc.model'), 'ER7206'],
      [t('desc.ip'), <span className="omada-mono">192.168.0.1</span>],
      [t('desc.mac'), <span className="omada-mono">AC:84:C6:1A:2B:3C</span>],
      [t('desc.firmware'), '1.2.4'],
      [t('desc.site'), 'HQ — Floor 3'],
      [t('desc.uptime'), '14d 6h 22m'],
    ];
    return (
      <>
        <div className="row" style={{ display: 'block' }}>
          <span className="label" style={{ display: 'block', marginBottom: 10 }}>bordered · horizontal</span>
          <Descriptions bordered column={2} size="middle"
            title={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              ER7206 <StatusPill status="connected" lang={lang} />
            </span>}>
            {facts.map(([l, v], i) => <Item key={i} label={l}>{v}</Item>)}
          </Descriptions>
        </div>
        <div className="row" style={{ display: 'block', marginTop: 18 }}>
          <span className="label" style={{ display: 'block', marginBottom: 10 }}>vertical · borderless</span>
          <Descriptions layout="vertical" column={4}>
            {facts.slice(0, 4).map(([l, v], i) => <Item key={i} label={l}>{v}</Item>)}
          </Descriptions>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Descriptions = DescriptionsDemo;
})();
