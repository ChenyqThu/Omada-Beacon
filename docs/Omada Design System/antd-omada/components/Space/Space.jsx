/* ────────────────────────────────────────────────────────────────────────
   components/Space/Space.jsx — OmadaSpace

   Thin wrapper over antd <Space> — the layout primitive that sets consistent
   gaps between inline children (toolbars, button rows, tag rows) without
   hand-rolled margins. Omada maps its size presets to the 8-grid spacing
   scale used across the Figma (sm 8 · md 16 · lg 24); any antd value still
   passes through. Re-exports <Space.Compact> for seamless control groups.

   This is purely structural (gaps), so there is nothing to theme — it works
   in light + dark unchanged.

   Exports: window.Omada.Space (+ .Compact)
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Space: AntSpace } = window.antd;

  // Omada 8-grid spacing presets (px). antd's named sizes are ~8/16/24 too,
  // but we pin them so Space matches the rest of the system exactly.
  const SIZE = { small: 8, middle: 16, large: 24 };

  function OmadaSpace({ size = 'middle', className = '', children, ...rest }) {
    const resolved = typeof size === 'string' && SIZE[size] != null ? SIZE[size] : size;
    const cls = ['omada-space', className].filter(Boolean).join(' ');
    return <AntSpace size={resolved} className={cls} {...rest}>{children}</AntSpace>;
  }

  OmadaSpace.Compact = AntSpace.Compact;

  window.Omada = window.Omada || {};
  window.Omada.Space = OmadaSpace;
})();
