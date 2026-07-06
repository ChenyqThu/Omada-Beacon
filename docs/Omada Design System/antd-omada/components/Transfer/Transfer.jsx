/* ────────────────────────────────────────────────────────────────────────
   components/Transfer/Transfer.jsx — OmadaTransfer

   Thin wrapper over antd Transfer — the dual-list "shuttle" for assigning
   devices between Unassigned ↔ In this site. Defaults to 240px panels with a
   6px radius, a quiet grey-50 header bar, OmadaIcon arrows on the operation
   buttons, and search on both lists. `oneWay` and `showSelectAll` forwarded.

   Visuals: Transfer tokens (listWidth 240, header/item heights, radius 6) from
   omada-theme.js; header bar bg + list radius from omada-overrides.css (dark
   twins). Strings via window.t() — antd's own "x items" footer comes from
   ConfigProvider locale.

   Figma: Transfer 穿梭框 (node 3:20324) — 240×418 panels, 6px radius, border
   #ECECEC, 16px gap, grey header bar.

   Exports: window.Omada.Transfer
   ──────────────────────────────────────────────────────────────────────── */

const { Transfer: AntTransfer } = window.antd;

function OmadaTransfer({ className = '', showSearch = true, listStyle, operations, ...rest }) {
  const cls = ('omada-transfer ' + className).trim();
  const ls = { width: 240, height: 320, ...listStyle };
  const ops = operations || [
    <window.OmadaIcon name="chevron-right" size={15} key="r" />,
    <window.OmadaIcon name="chevron-left" size={15} key="l" />,
  ];
  return <AntTransfer className={cls} showSearch={showSearch} listStyle={ls} operations={ops} {...rest} />;
}

window.Omada = window.Omada || {};
window.Omada.Transfer = OmadaTransfer;
