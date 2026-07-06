/* ────────────────────────────────────────────────────────────────────────
   components/Descriptions/Descriptions.jsx — OmadaDescriptions

   Thin wrapper over antd Descriptions — the label/value fact list used on
   device-detail panels. Two layouts from the Figma: side-by-side (`layout
   "horizontal"`, default) and stacked (`layout="vertical"`). Omada defaults:
   no colon (labels read as headers), label colour = colorTextSecondary,
   value colour = colorText. Bordered variant forwards straight to antd.

   Figma: 描述列表 Descriptions node 60:45920 (左右 / 上下 specimens, 14px).

   Exports: window.Omada.Descriptions
   ──────────────────────────────────────────────────────────────────────── */

const { Descriptions: AntDescriptions } = window.antd;

function OmadaDescriptions({ colon = false, labelStyle, contentStyle, className, children, ...rest }) {
  const cls = ['omada-desc', className].filter(Boolean).join(' ');
  return (
    <AntDescriptions
      colon={colon}
      className={cls}
      labelStyle={{ fontWeight: 400, ...labelStyle }}
      contentStyle={{ fontWeight: 500, ...contentStyle }}
      {...rest}
    >
      {children}
    </AntDescriptions>
  );
}

/* Re-expose Descriptions.Item for the children API. */
OmadaDescriptions.Item = AntDescriptions.Item;

window.Omada = window.Omada || {};
window.Omada.Descriptions = OmadaDescriptions;
