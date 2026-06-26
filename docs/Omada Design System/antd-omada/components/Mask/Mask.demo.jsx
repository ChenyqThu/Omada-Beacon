/* components/Mask/Mask.demo.jsx — window.OmadaDemos.Mask */
(function () {
  const { Mask, Button, Spin, Card, Icon } = window.Omada;
  const { useState } = React;

  // A small device panel the mask sits over.
  function Panel({ children }) {
    return (
      <div style={{ position: 'relative', borderRadius: 8, border: '1px solid var(--border-default)', overflow: 'hidden', minHeight: 196, background: 'var(--bg-surface, #fff)' }}>
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>EAP670 — Access Point</div>
          <div style={{ fontSize: 13, color: 'var(--fg-secondary)' }}>192.168.0.42 · v1.3.0</div>
          <div style={{ display: 'flex', gap: 18, marginTop: 4 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: 12, color: 'var(--fg-tertiary)' }}>Clients</span><span style={{ fontSize: 18, fontWeight: 600 }}>64</span></div>
            <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: 12, color: 'var(--fg-tertiary)' }}>Tx</span><span style={{ fontSize: 18, fontWeight: 600 }}>120 Mbps</span></div>
          </div>
        </div>
        {children}
      </div>
    );
  }

  function MaskDemo() {
    const { t } = window.useOmada();
    const [loading, setLoading] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [frost, setFrost] = useState(false);

    const runLoad = () => { setLoading(true); setTimeout(() => setLoading(false), 1800); };

    return (
      <>
        <div className="row"><span className="label">loading scrim · blur</span></div>
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Button variant="secondary" size="small" onClick={runLoad}>{t('mask.simulate')}</Button>
            <Panel>
              <Mask open={loading} blur>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                  <Spin />
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{t('mask.applying')}</span>
                </div>
              </Mask>
            </Panel>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Button variant="secondary" size="small" onClick={() => setConfirm(true)}>{t('mask.block')}</Button>
            <Panel>
              <Mask open={confirm} closable onClose={() => setConfirm(false)}>
                <Card variant="shadow" size="small" style={{ width: 260 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span className="omada-card-glyph" style={{ color: 'var(--omada-orange, #FF8C27)' }}><Icon name="warning" size={20} /></span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{t('pop.rebootTitle')}</span>
                      <span style={{ fontSize: 12, color: 'var(--fg-secondary)' }}>{t('pop.rebootBody')}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14 }}>
                    <Button variant="text" size="small" onClick={() => setConfirm(false)}>{t('common.cancel')}</Button>
                    <Button variant="primary" size="small" onClick={() => setConfirm(false)}>{t('common.confirm')}</Button>
                  </div>
                </Card>
              </Mask>
            </Panel>
          </div>
        </div>

        <div className="row" style={{ marginTop: 22 }}><span className="label">light tone · frost</span></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 360 }}>
          <Button variant="secondary" size="small" onClick={() => setFrost((v) => !v)}>{frost ? t('common.close') : t('mask.frost')}</Button>
          <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', minHeight: 140, background: '#1A1A1A', color: '#fff', padding: 16 }}>
            <div style={{ fontSize: 13, opacity: 0.9 }}>{t('mask.lockedBody')}</div>
            <Mask open={frost} tone="light" blur closable onClose={() => setFrost(false)}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: '#2B2B2B' }}>
                <Icon name="lock" size={16} />{t('mask.locked')}
              </span>
            </Mask>
          </div>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Mask = MaskDemo;
})();
