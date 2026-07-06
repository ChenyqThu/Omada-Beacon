/* components/FloatButton/FloatButton.demo.jsx — window.OmadaDemos.FloatButton */
(function () {
  const { FloatButton } = window.Omada;
  const { Icon } = window.Omada;
  const { useRef, useState, useEffect } = React;

  function FloatButtonDemo() {
    const { t } = window.useOmada();
    const boxRef = useRef(null);
    const [box, setBox] = useState(null);
    useEffect(() => { setBox(boxRef.current); }, []);

    return (
      <>
        <div className="row"><span className="label">pinned</span>
          <span style={{ fontSize: 12, color: 'var(--fg-tertiary)' }}>{t('float.hint')}</span>
        </div>
        {/* a positioned stage so the fixed buttons pin inside the demo, not the page */}
        <div ref={boxRef}
          style={{ position: 'relative', overflow: 'auto', height: 300,
                   border: '1px solid var(--border-default)', borderRadius: 8, padding: '0 16px 16px' }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <p key={i} style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--fg-secondary)', margin: '14px 0', maxWidth: 560 }}>
              {t('type.body')}
            </p>
          ))}

          {box && (
            <>
              {/* single primary action */}
              <FloatButton
                variant="primary"
                iconName="plus"
                tooltip={t('float.add')}
                style={{ position: 'absolute', insetInlineEnd: 88, bottom: 24 }}
              />
              {/* speed-dial group */}
              <FloatButton.Group
                trigger="hover"
                iconName="more-vertical"
                tooltip={t('float.actions')}
                style={{ position: 'absolute', insetInlineEnd: 24, bottom: 84 }}
              >
                <FloatButton iconName="help-circle" tooltip={t('float.help')} />
                <FloatButton iconName="edit" tooltip={t('float.feedback')} />
              </FloatButton.Group>
              {/* back to top */}
              <FloatButton.BackTop
                target={() => box}
                visibilityHeight={0}
                tooltip={t('float.backTop')}
                icon={<Icon name="chevron-up" size={18} />}
                style={{ position: 'absolute', insetInlineEnd: 24, bottom: 24 }}
              />
            </>
          )}
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.FloatButton = FloatButtonDemo;
})();
