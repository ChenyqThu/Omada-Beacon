/* ────────────────────────────────────────────────────────────────────────
   components/Badge/Badge.jsx — OmadaBadge

   Thin wrapper over antd Badge. The numeric badge / dot used on icons, tabs
   and list items. `tone` is an Omada convenience that maps to the semantic
   ribbon colour; everything else (count, dot, overflowCount, offset, status,
   standalone) forwards straight to antd.

   Metrics (fontSize 11 / weight 700) live in omada-theme.js → components.Badge.

   Figma: Badge 徽标数 node 3:25644.

   Exports: window.Omada.Badge
   ──────────────────────────────────────────────────────────────────────── */

const { Badge: AntBadge } = window.antd;

/* Omada tone → antd semantic colour token name */
const OM_BADGE_TONE = {
  brand:   undefined,          // antd default red unless color set; brand via token below
  success: 'green',
  error:   'red',
  warning: 'gold',
  info:    'blue',
  neutral: 'default',
};

function OmadaBadge({ tone, color, children, ...rest }) {
  delete rest.tone;
  const c = color != null ? color : (tone ? OM_BADGE_TONE[tone] : undefined);
  return <AntBadge color={c} {...rest}>{children}</AntBadge>;
}

/* Re-expose Badge.Ribbon so callers can use <Badge.Ribbon> unchanged. */
OmadaBadge.Ribbon = AntBadge.Ribbon;

window.Omada = window.Omada || {};
window.Omada.Badge = OmadaBadge;
