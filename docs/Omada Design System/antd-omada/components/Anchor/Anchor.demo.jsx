/* components/Anchor/Anchor.demo.jsx — window.OmadaDemos.Anchor */
(function () {
  const { Anchor } = window.Omada;
  const { useRef, useState, useEffect } = React;

  function AnchorDemo() {
    const { t } = window.useOmada();
    const boxRef = useRef(null);
    const [container, setContainer] = useState(null);
    useEffect(() => { setContainer(boxRef.current); }, []);

    const sections = [
      { id: 'om-anchor-overview', key: 'anchor.overview', icon: 'dashboard' },
      { id: 'om-anchor-devices',  key: 'anchor.devices',  icon: 'devices' },
      { id: 'om-anchor-clients',  key: 'anchor.clients',  icon: 'clients' },
      { id: 'om-anchor-settings', key: 'anchor.settings', icon: 'settings' },
    ];

    return (
      <>
        <div className="row"><span className="label">scroll-spy</span>
          <span style={{ fontSize: 12, color: 'var(--fg-tertiary)' }}>{t('anchor.hint')}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 20, alignItems: 'start' }}>
          <Anchor
            getContainer={() => container || window}
            targetOffset={16}
            affix={false}
            items={sections.map((s) => ({ key: s.id, href: '#' + s.id, title: t(s.key) }))}
          />
          <div ref={boxRef}
            style={{ height: 260, overflow: 'auto', border: '1px solid var(--border-default)',
                     borderRadius: 8, padding: '4px 18px' }}>
            {sections.map((s) => (
              <div key={s.id} id={s.id} style={{ paddingTop: 16, paddingBottom: 20, minHeight: 150 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 8px', color: 'var(--fg-primary)' }}>
                  {t(s.key)}
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--fg-secondary)', margin: 0, maxWidth: 460 }}>
                  {t('type.body')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Anchor = AnchorDemo;
})();
