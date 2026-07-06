/* ────────────────────────────────────────────────────────────────────────
   components/Collapse/Collapse.jsx — OmadaCollapse

   Thin wrapper over antd Collapse in the Omada "card" style: each panel is a
   rounded card with a white header (10px 16px) and a grey-50 body (16px 28px),
   8px radius, separated by a 12px gap. The expander is the OmadaIcon chevron
   (rotates), positioned at the END of the row (Figma puts the arrow far-right).
   A `variant="ghost"` strips the cards for a hairline-rule list.

   Visuals: the split header/body radius, gap, and surfaces can't be expressed
   as antd tokens, so they live in omada-overrides.css `.omada-collapse`
   (light + dark twins). Use the `.omada-collapse-status` class for the green
   trailing status text. Strings via window.t().

   Figma: Collapse 折叠面版 (node 3:24623) — 800px card, header border #ECECEC,
   radius 8, body bg #F7F7F7, title Manrope 500/14, green status text, up/down
   chevron at the right edge.

   Exports: window.Omada.Collapse
   ──────────────────────────────────────────────────────────────────────── */

const { Collapse: AntCollapse } = window.antd;

function collapseExpandIcon({ isActive } = {}) {
  return (
    <window.OmadaIcon
      name="chevron-down"
      size={16}
      style={{ transform: isActive ? 'none' : 'rotate(-90deg)', transition: 'transform 180ms cubic-bezier(0.16,1,0.3,1)' }}
    />
  );
}

function OmadaCollapse({ variant = 'card', className = '', expandIcon = collapseExpandIcon,
                         expandIconPosition = 'end', bordered, ...rest }) {
  const cls = ['omada-collapse', variant === 'ghost' ? 'omada-collapse-ghost' : '', className]
    .filter(Boolean).join(' ');
  return (
    <AntCollapse
      className={cls}
      bordered={false}
      ghost={variant === 'ghost'}
      expandIcon={expandIcon}
      expandIconPosition={expandIconPosition}
      {...rest}
    />
  );
}

OmadaCollapse.Panel = AntCollapse.Panel;

window.Omada = window.Omada || {};
window.Omada.Collapse = OmadaCollapse;
