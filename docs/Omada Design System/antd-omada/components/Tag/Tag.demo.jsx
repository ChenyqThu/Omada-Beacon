/* components/Tag/Tag.demo.jsx — Mounted by index.html. window.OmadaDemos.Tag */
(function () {
  const { Tag, StatusPill } = window.Omada;

  function TagDemo() {
    const { lang } = window.useOmada();
    return (
      <>
        <div className="row">
          <span className="label">tone</span>
          <Tag>WAN1</Tag>
          <Tag tone="success">{window.t('status.online', lang)}</Tag>
          <Tag tone="processing">{window.t('status.adopting', lang)}</Tag>
          <Tag tone="warning">{window.t('status.pending', lang)}</Tag>
          <Tag tone="error">{window.t('status.error', lang)}</Tag>
          <Tag tone="neutral">{window.t('status.skipped', lang)}</Tag>
        </div>
        <div className="row">
          <span className="label">closeable</span>
          <Tag closable>site = NYC</Tag>
          <Tag closable tone="success">status = online</Tag>
          <Tag closable tone="processing">type = AP</Tag>
        </div>
        <div className="row">
          <span className="label">status pill</span>
          <StatusPill status="connected" lang={lang} />
          <StatusPill status="adopting" lang={lang} />
          <StatusPill status="pending" lang={lang} />
          <StatusPill status="disconnected" lang={lang} />
          <StatusPill status="skipped" lang={lang} />
        </div>
        <div className="row">
          <span className="label">marker</span>
          <Tag color="#FF8C27" style={{ borderRadius: 999, padding: '2px 8px', fontSize: 10, fontWeight: 700, letterSpacing: 0.5, border: 0 }}>BETA</Tag>
          <Tag color="#0069CB" style={{ borderRadius: 999, padding: '2px 8px', fontSize: 10, fontWeight: 700, letterSpacing: 0.5, border: 0 }}>NEW</Tag>
          <Tag color="#2B2B2B" style={{ borderRadius: 999, padding: '2px 8px', fontSize: 10, fontWeight: 700, letterSpacing: 0.5, border: 0 }}>PRO</Tag>
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Tag = TagDemo;
})();
