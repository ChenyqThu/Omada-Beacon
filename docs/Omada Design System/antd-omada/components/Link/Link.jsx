/* ────────────────────────────────────────────────────────────────────────
   components/Link/Link.jsx — OmadaLink

   Typography.Link promoted to its own component. The Figma "Text 文本" page
   fixes link colour to the brand green hover treatment already wired into the
   Breadcrumb linkColor / linkHoverColor tokens, so a bare wrapper would read
   correctly — but a product UI keeps reaching for the same three affordances,
   so we add them as conveniences:

     • icon      → a leading OmadaIcon glyph (name string or a node)
     • external  → opens in a new tab with rel="noopener noreferrer" AND
                   appends the `external-link` trailing glyph automatically
     • size      → 'sm' | 'default' | 'lg'  (12 / 14 / 16px, on the type scale)

   Everything antd Typography.Link supports (href, target, onClick, disabled,
   strong, italic, underline, type='danger'|'secondary'|'success', copyable,
   ellipsis) is forwarded. Colour comes from the omada-link CSS hook (green
   rest → darker green hover, + dark twin); no brand hex in the JSX.

   Figma: Text 文本 node 565:49687 (family/usage) — link == brand-green text.
   Exports: window.Omada.Link
   ──────────────────────────────────────────────────────────────────────── */

const { Typography: AntTypographyForLink } = window.antd;
const AntLink = AntTypographyForLink.Link;

const OM_LINK_SIZE = { sm: 12, default: 14, lg: 16 };

function OmadaLink(props) {
  const icon = props.icon;
  const external = props.external;
  const size = props.size || 'default';
  const className = props.className || '';
  const children = props.children;

  const rest = Object.assign({}, props);
  delete rest.icon; delete rest.external; delete rest.size;
  delete rest.className; delete rest.children;

  // external → new-tab + safe rel + auto trailing glyph
  if (external) {
    if (rest.target === undefined) rest.target = '_blank';
    if (rest.rel === undefined) rest.rel = 'noopener noreferrer';
  }

  const px = OM_LINK_SIZE[size] || 14;
  const cls = ['omada-link', className].filter(Boolean).join(' ');
  const style = Object.assign({ fontSize: px }, rest.style);
  delete rest.style;

  const leading = icon
    ? (typeof icon === 'string'
        ? <window.OmadaIcon name={icon} size={px + 2} />
        : icon)
    : null;
  const trailing = external
    ? <window.OmadaIcon name="external-link" size={px} className="omada-link-ext" />
    : null;

  return (
    <AntLink className={cls} style={style} {...rest}>
      {leading}
      <span className="omada-link-label">{children}</span>
      {trailing}
    </AntLink>
  );
}

window.Omada = window.Omada || {};
window.Omada.Link = OmadaLink;
