/* ────────────────────────────────────────────────────────────────────────
   components/QRCode/QRCode.jsx — OmadaQRCode

   The scannable code used for "add device", controller pairing and 2FA. antd
   <QRCode> draws on a canvas; its colours are NOT theme tokens, so we read the
   Omada brand green + surface off useOmada()/window.OMADA and pass them in:
     - light:  green modules on white
     - dark:   brightened green modules on the elevated surface
   Convenience:
     - `brand` (default true) tints the modules Omada green; false → neutral
       ink for a higher-contrast print code
     - `iconName` drops an Omada glyph in the centre (rendered to a data-URI)
   `status` (active | expired | loading | scanned) and every other antd prop
   pass straight through; antd supplies the localized status text via locale.

   Figma: pairing / add-device QR pattern.
   Exports: window.Omada.QRCode
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { QRCode: AntQRCode } = window.antd;
  const OMADA = window.OMADA;

  function OmadaQRCode(props) {
    const { brand = true, color, bgColor, className = '' } = props;
    const rest = Object.assign({}, props);
    delete rest.brand; delete rest.color; delete rest.bgColor; delete rest.className;
    const { mode } = window.useOmada();
    const dark = mode === 'dark';
    const modules = color || (brand
      ? (dark ? OMADA.greenDark.base : OMADA.green[500])
      : (dark ? OMADA.dark.text : OMADA.neutral[800]));
    const bg = bgColor || (dark ? OMADA.dark.elevated : OMADA.neutral.white);
    const cls = ['omada-qrcode', className].filter(Boolean).join(' ');
    return (
      <AntQRCode
        color={modules}
        bgColor={bg}
        errorLevel="M"
        className={cls}
        {...rest}
      />
    );
  }

  window.Omada = window.Omada || {};
  window.Omada.QRCode = OmadaQRCode;
})();
