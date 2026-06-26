/* components/Image/Image.demo.jsx — window.OmadaDemos.Image */
(function () {
  const { Image } = window.Omada;

  // Striped SVG placeholder (per design-system guidance — no hand-drawn art).
  function placeholder(label, dark) {
    const bg = dark ? '#262626' : '#F4F4F4';
    const stripe = dark ? '#2E2E2E' : '#ECECEC';
    const ink = dark ? '#737373' : '#999999';
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='220'>
      <defs><pattern id='p' width='14' height='14' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'>
        <rect width='14' height='14' fill='${bg}'/><rect width='7' height='14' fill='${stripe}'/>
      </pattern></defs>
      <rect width='320' height='220' fill='url(#p)'/>
      <text x='50%' y='50%' fill='${ink}' font-family='monospace' font-size='13' text-anchor='middle' dominant-baseline='middle'>${label}</text>
    </svg>`;
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  }

  function ImageDemo() {
    const { t, mode } = window.useOmada();
    const dark = mode === 'dark';
    const shots = [
      { label: 'EAP670 — front', cap: t('image.front') },
      { label: 'EAP670 — ports', cap: t('image.ports') },
      { label: 'topology.png', cap: t('image.topology') },
    ];
    return (
      <>
        <div className="row"><span className="label">{t('image.gallery')}</span>
          <span style={{ fontSize: 12, color: 'var(--fg-tertiary)' }}>{t('image.hint')}</span>
        </div>
        <Image.PreviewGroup>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {shots.map((s, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Image src={placeholder(s.label, dark)} width={210} height={144} />
                <span style={{ fontSize: 12, color: 'var(--fg-secondary)' }}>{s.cap}</span>
              </div>
            ))}
          </div>
        </Image.PreviewGroup>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Image = ImageDemo;
})();
