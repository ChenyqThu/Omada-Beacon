/* ────────────────────────────────────────────────────────────────────────
   components/Watermark/Watermark.jsx — OmadaWatermark

   Repeating tamper-evident overlay for sensitive panels (config exports,
   topology snapshots, account screens). antd <Watermark> renders a canvas
   tile and tiles it behind the children. We default the font colour + size to
   read as a faint Omada-neutral mark and follow the dark theme automatically
   by reading the text token off useOmada() (light → neutral-500 @ low alpha,
   dark → light text @ low alpha). The caller still overrides any antd prop.

   Convenience: pass `content` (string | string[]); we set a tasteful default
   font (Manrope, 15px, low-opacity) sourced from the active theme so it never
   hard-codes a colour.

   Figma: confidentiality overlay pattern (account / export screens).
   Exports: window.Omada.Watermark
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Watermark: AntWatermark } = window.antd;

  function OmadaWatermark(props) {
    const { font, gap, rotate = -22, children } = props;
    const rest = Object.assign({}, props);
    delete rest.font; delete rest.gap; delete rest.rotate; delete rest.children;
    const { mode } = window.useOmada();
    const color = mode === 'dark' ? 'rgba(232,232,232,0.10)' : 'rgba(99,99,99,0.13)';
    const mergedFont = {
      fontFamily: "'Manrope', 'PingFang SC', sans-serif",
      fontSize: 15,
      fontWeight: 500,
      color,
      ...font,
    };
    return (
      <AntWatermark font={mergedFont} gap={gap || [120, 100]} rotate={rotate} {...rest}>
        {children}
      </AntWatermark>
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.Watermark = OmadaWatermark;
})();
