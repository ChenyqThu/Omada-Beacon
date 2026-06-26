/* components/Icon/Icon.demo.jsx — Mounted by index.html. window.OmadaDemos.Icon */
(function () {
  const { Icon } = window.Omada;

  function IconDemo() {
    const { mode } = window.useOmada();
    const names = Object.keys(window.OMADA_ICONS);
    const labelColor = mode === 'dark' ? '#737373' : '#999';
    const cellBorder = mode === 'dark' ? '#2A2A2A' : '#ECECEC';
    const fg = mode === 'dark' ? '#E8E8E8' : '#2B2B2B';

    return (
      <>
        <div className="row">
          <span className="label">size</span>
          <span style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 18, color: fg }}>
            <Icon name="settings" size={16} /><span style={{ fontSize: 11, color: labelColor }}>16</span>
            <Icon name="settings" size={20} /><span style={{ fontSize: 11, color: labelColor }}>20</span>
            <Icon name="settings" size={24} /><span style={{ fontSize: 11, color: labelColor }}>24</span>
          </span>
        </div>
        <div className="row">
          <span className="label">currentColor</span>
          <span style={{ color: '#00A870' }}><Icon name="check-circle" size={22} /></span>
          <span style={{ color: '#FF8C27' }}><Icon name="warning" size={22} /></span>
          <span style={{ color: '#EE385C' }}><Icon name="ban" size={22} /></span>
          <span style={{ color: '#0069CB' }}><Icon name="info" size={22} /></span>
          <span style={{ color: labelColor }}><Icon name="more-horizontal" size={22} /></span>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
          gap: 8, marginTop: 14,
        }}>
          {names.map((n) => (
            <div key={n} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              padding: '14px 6px', border: `1px solid ${cellBorder}`, borderRadius: 8, color: fg,
            }}>
              <Icon name={n} size={22} />
              <span style={{ fontSize: 10, color: labelColor, fontFamily: 'var(--font-mono, monospace)', textAlign: 'center', wordBreak: 'break-word' }}>{n}</span>
            </div>
          ))}
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Icon = IconDemo;
})();
