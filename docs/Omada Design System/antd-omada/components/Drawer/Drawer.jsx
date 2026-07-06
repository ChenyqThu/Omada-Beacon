/* ────────────────────────────────────────────────────────────────────────
   components/Drawer/Drawer.jsx — OmadaDrawer

   Thin wrapper over antd Drawer. Omada defaults from the Figma "Drawer 抽屉":
   380 default width (the device-detail / filter panel width), the OmadaIcon
   close glyph, and the drawer shadow (#2B2B2B 10% / black 24% dark — driven
   by token.boxShadowSecondary). 16px radius lives in components.Drawer; in
   practice antd only rounds the edge that floats, so the corners read on the
   inner content. A `footer` of Apply / Cancel is the common pattern (filter
   drawer) — pass it as the antd `footer` node.

   Figma: Drawer 抽屉 node 25331:112308 + the /Drawer specimens (device detail,
   filter panel; right & left placement).

   Exports: window.Omada.Drawer
   ──────────────────────────────────────────────────────────────────────── */

const { Drawer: AntDrawer } = window.antd;

function OmadaDrawer({ width = 380, closeIcon, placement = 'right', ...rest }) {
  const ci = closeIcon !== undefined
    ? closeIcon
    : (window.OmadaIcon ? <window.OmadaIcon name="close" size={18} /> : undefined);
  return <AntDrawer width={width} placement={placement} closeIcon={ci} {...rest} />;
}

window.Omada = window.Omada || {};
window.Omada.Drawer = OmadaDrawer;
