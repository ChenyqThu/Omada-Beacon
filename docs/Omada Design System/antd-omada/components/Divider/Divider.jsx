/* ────────────────────────────────────────────────────────────────────────
   components/Divider/Divider.jsx — OmadaDivider

   Thin wrapper over antd <Divider>. The Figma "Driver 分割线" page fixes a
   single rule: a 1px line in #ECECEC (dark twin: #333). With-text dividers
   put a 12px / #999 Manrope label inline. The colour is already the
   `Divider.colorSplit` token in both themes, so this wrapper only forwards
   props + tags the text style via a class the overrides can reach.

   Forwards all antd Divider props:
     · type="horizontal" | "vertical"
     · orientation="left" | "center" | "right"  (label position)
     · dashed, plain, variant, size

   Figma: Driver 分割线 node 141:1951 · dark node 3:15830.
   Exports: window.Omada.Divider
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Divider: AntDivider } = window.antd;

  function OmadaDivider({ className = '', children, ...rest }) {
    const cls = ['omada-divider', className].filter(Boolean).join(' ');
    return <AntDivider className={cls} {...rest}>{children}</AntDivider>;
  }

  window.Omada = window.Omada || {};
  window.Omada.Divider = OmadaDivider;
})();
