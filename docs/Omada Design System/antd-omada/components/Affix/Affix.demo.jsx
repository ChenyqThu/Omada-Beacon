/* components/Affix/Affix.demo.jsx — window.OmadaDemos.Affix */
(function () {
  const { Affix, Button } = window.Omada;
  const { useRef, useState, useEffect } = React;

  function AffixDemo() {
    const { t } = window.useOmada();
    const boxRef = useRef(null);
    const [container, setContainer] = useState(null);
    useEffect(() => { setContainer(boxRef.current); }, []);

    return (
      <>
        <div className="row"><span className="label">sticky</span>
          <span style={{ fontSize: 12, color: 'var(--fg-tertiary)' }}>{t('affix.hint')}</span>
        </div>
        <div ref={boxRef}
          style={{ height: 280, overflow: 'auto', border: '1px solid var(--border-default)',
                   borderRadius: 8, padding: '0 16px 16px' }}>
          <Affix offsetTop={8} target={() => container} lifted>
            <div className="omada-affix-bar"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                       gap: 12, padding: '10px 14px' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-primary)' }}>{t('affix.toolbar')}</span>
              <span style={{ display: 'inline-flex', gap: 8 }}>
                <Button variant="text" size="small">{t('common.reset')}</Button>
                <Button variant="primary" size="small">{t('affix.applyAll')}</Button>
              </span>
            </div>
          </Affix>
          <p style={{ fontSize: 12, color: 'var(--fg-tertiary)', margin: '6px 0 14px' }}>{t('affix.stuck')}</p>
          {Array.from({ length: 8 }).map((_, i) => (
            <p key={i} style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--fg-secondary)', margin: '0 0 14px', maxWidth: 560 }}>
              {t('type.body')}
            </p>
          ))}
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Affix = AffixDemo;
})();
