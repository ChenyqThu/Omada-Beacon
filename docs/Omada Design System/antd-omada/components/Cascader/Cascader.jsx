/* ────────────────────────────────────────────────────────────────────────
   components/Cascader/Cascader.jsx — OmadaCascader

   Thin wrapper over antd Cascader — the multi-column region/location picker
   (Region › City › Site). Defaults to the OmadaIcon chevron suffix, 4px
   radius, green active-option tint, and a sensible 260px control width. The
   per-column expand arrow uses the OmadaIcon chevron. Single + multiple,
   search, and `changeOnSelect` (pick any level) all supported.

   Visuals: Cascader option tokens (controlItemBgActive green-50) +
   Select control tokens from omada-theme.js; dropdown shadow from
   omada-overrides.css. Strings via window.t().

   Figma: Cascader 级联选择 (page node 43:34729) — control matches Select 选择器,
   columns use the green selected tint + chevron expand icon.

   Exports: window.Omada.Cascader
   ──────────────────────────────────────────────────────────────────────── */

const { Cascader: AntCascader } = window.antd;

function expandIcon() {
  return <window.OmadaIcon name="chevron-right" size={16} style={{ verticalAlign: '-2px' }} />;
}

function OmadaCascader({ className = '', popupClassName = '', suffixIcon, style, ...rest }) {
  const cls = ('omada-cascader ' + className).trim();
  const pcls = ('omada-cascader-pop ' + popupClassName).trim();
  return (
    <AntCascader
      className={cls}
      popupClassName={pcls}
      expandIcon={expandIcon()}
      suffixIcon={suffixIcon !== undefined ? suffixIcon : <window.OmadaIcon name="chevron-down" size={16} />}
      style={{ width: 260, ...style }}
      {...rest}
    />
  );
}

OmadaCascader.Panel = AntCascader.Panel;

window.Omada = window.Omada || {};
window.Omada.Cascader = OmadaCascader;
