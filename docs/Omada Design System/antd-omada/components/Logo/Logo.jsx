/* ────────────────────────────────────────────────────────────────────────
   components/Logo/Logo.jsx — OmadaLogo

   Real Omada brand marks, extracted from the source Figma as vector SVG:
     · lockup   — "omada by tp-link" horizontal wordmark (dark ink; pass
                  variant="light" / on a dark surface use invert via CSS)
     · appicon  — teal rounded-square app icon with the white O-mark

   <Logo variant="lockup" height={32} />
   <Logo variant="appicon" size={64} />

   Exports: window.OmadaLogo, window.Omada.Logo
   ──────────────────────────────────────────────────────────────────────── */

window.OMADA_LOGOS = {
  lockup:  { f: 'omada-lockup.svg',  ratio: 120 / 45 },
  appicon: { f: 'omada-appicon.svg', ratio: 1 },
};

function OmadaLogo(props) {
  const variant = props.variant || 'lockup';
  const base = props.base || window.OMADA_LOGO_BASE || 'assets/logos/';
  const className = props.className || '';
  const style = props.style;
  const entry = window.OMADA_LOGOS[variant] || window.OMADA_LOGOS.lockup;

  // sizing: appicon by `size` (square); lockup by `height` (width auto)
  const isIcon = variant === 'appicon';
  const h = isIcon ? (props.size || 48) : (props.height || 32);

  const rest = Object.assign({}, props);
  ['variant', 'base', 'className', 'style', 'size', 'height'].forEach((k) => delete rest[k]);

  return (
    <img
      src={base + entry.f}
      alt={props.alt || (variant === 'appicon' ? 'Omada' : 'Omada by TP-Link')}
      height={h}
      width={isIcon ? h : undefined}
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
      {...rest}
    />
  );
}

window.Omada = window.Omada || {};
window.Omada.Logo = OmadaLogo;
window.OmadaLogo = OmadaLogo;
