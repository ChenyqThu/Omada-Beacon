/* ────────────────────────────────────────────────────────────────────────
   components/Tooltip/Tooltip.jsx — OmadaTooltip

   Thin wrapper over antd Tooltip. Omada defaults match the Figma spec:
   dark spotlight surface (rgba(43,43,43,0.96) light / #383838 dark via token),
   4px radius, 12–14px text, arrow shown, 120ms appear. All colour/radius come
   from omada-theme.js → components.Tooltip + token.colorBgSpotlight.

   Figma: Tooltip 文字提示 node 3:25676 (12 placement/arrow specimens).

   Exports: window.Omada.Tooltip
   ──────────────────────────────────────────────────────────────────────── */

const { Tooltip: AntTooltip } = window.antd;

function OmadaTooltip({ mouseEnterDelay = 0.05, children, ...rest }) {
  return (
    <AntTooltip mouseEnterDelay={mouseEnterDelay} {...rest}>
      {children}
    </AntTooltip>
  );
}

window.Omada = window.Omada || {};
window.Omada.Tooltip = OmadaTooltip;
