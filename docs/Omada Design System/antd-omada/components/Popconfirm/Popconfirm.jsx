/* ────────────────────────────────────────────────────────────────────────
   components/Popconfirm/Popconfirm.jsx — OmadaPopconfirm

   Thin wrapper over antd Popconfirm (the inline "are you sure?" bubble that
   hangs off a trigger — distinct from Popover's rich card and Modal's
   centered dialog). Omada defaults: an OmadaIcon glyph in place of antd's
   default, `tone` to pick the colour + danger OK, and OK/Cancel labels from
   antd ConfigProvider locale.

     tone="danger"  → red warning glyph + danger OK button  (delete / forget)
     tone="warning" → orange warning glyph                  (reversible risk)
     tone="info"    → blue info glyph

   Bubble radius (8px) + shadow come from the shared Popover tokens.

   Figma: Popover 气泡卡片 confirm variant — node 3:25129.

   Exports: window.Omada.Popconfirm
   ──────────────────────────────────────────────────────────────────────── */

const { Popconfirm: AntPopconfirm } = window.antd;

const OM_PC_TONE = {
  danger:  { icon: 'warning', color: 'var(--omada-red,#EE385C)',   danger: true },
  warning: { icon: 'warning', color: 'var(--omada-orange,#FF8C27)', danger: false },
  info:    { icon: 'info',    color: 'var(--omada-blue,#0069CB)',   danger: false },
};

function OmadaPopconfirm({ tone = 'warning', icon, okButtonProps, ...rest }) {
  delete rest.tone;
  const meta = OM_PC_TONE[tone] || OM_PC_TONE.warning;
  const glyph = icon !== undefined
    ? icon
    : (window.OmadaIcon ? <window.OmadaIcon name={meta.icon} size={18} style={{ color: meta.color }} /> : undefined);
  const okProps = { danger: meta.danger, ...okButtonProps };
  return <AntPopconfirm icon={glyph} okButtonProps={okProps} {...rest} />;
}

window.Omada = window.Omada || {};
window.Omada.Popconfirm = OmadaPopconfirm;
