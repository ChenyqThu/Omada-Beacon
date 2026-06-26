/* ────────────────────────────────────────────────────────────────────────
   components/Typography/Typography.jsx — OmadaTypography

   Thin wrapper over antd <Typography> and its statics (Title / Text /
   Paragraph / Link). The Figma "Text 文本" page fixes the type system:
     · family   Manrope → PingFang SC → Microsoft YaHei  (fontFamily token)
     · weights  Regular 400 · Medium 500 · Semibold 600
     · sizes    22 / 16 / 14 / 12 / 10  (+ heading scale 36/24/20/16/14)
     · colour   primary #2B2B2B · secondary #636363 · tertiary #999999
                dark: #FFFFFF @ 80% / 64% / 40%  (the colorText* tokens)
   All of that already lives in the seed tokens, so this wrapper just forwards
   props and re-exports the statics under window.Omada.* for ergonomic use.

   Figma: Text 文本 node 565:49687 (family) + 2300:2655 (weight/size/usage).
   Exports: window.Omada.Typography, .Title, .Text, .Paragraph, .Link
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Typography: AntTypography } = window.antd;

  function OmadaTypography({ className = '', children, ...rest }) {
    const cls = ['omada-typography', className].filter(Boolean).join(' ');
    return <AntTypography className={cls} {...rest}>{children}</AntTypography>;
  }

  OmadaTypography.Title     = AntTypography.Title;
  OmadaTypography.Text      = AntTypography.Text;
  OmadaTypography.Paragraph = AntTypography.Paragraph;
  OmadaTypography.Link      = AntTypography.Link;

  window.Omada = window.Omada || {};
  window.Omada.Typography = OmadaTypography;
  // convenience shortcuts
  window.Omada.Title     = AntTypography.Title;
  window.Omada.Text      = AntTypography.Text;
  window.Omada.Paragraph = AntTypography.Paragraph;
  window.Omada.Link      = AntTypography.Link;
})();
