/* ────────────────────────────────────────────────────────────────────────
   components/Image/Image.jsx — OmadaImage

   Image with click-to-preview (zoom / rotate / flip). antd <Image> +
   <Image.PreviewGroup> own the lightbox; we add:
     - an 8px Omada radius + hairline frame by default (token radius + a CSS
       hook with a dark twin)
     - an OmadaIcon "eye" preview mask label routed through useOmada().t so it
       translates, instead of antd's default English "Preview"
   Re-exports Image.PreviewGroup. All antd props forwarded.

   Figma: device-photo / topology-snapshot tiles from /Product + /Display.
   Exports: window.Omada.Image  (.PreviewGroup)
   ──────────────────────────────────────────────────────────────────────── */
(function () {
  const { Image: AntImage } = window.antd;
  const OmadaIcon = window.OmadaIcon;

  function OmadaImage(props) {
    const { framed = true, className = '', preview } = props;
    const rest = Object.assign({}, props);
    delete rest.framed; delete rest.className; delete rest.preview;
    const { t } = window.useOmada();
    const cls = ['omada-image', framed ? 'is-framed' : '', className].filter(Boolean).join(' ');
    const mergedPreview = preview === false ? false : {
      mask: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <OmadaIcon name="eye" size={16} />{t('image.preview')}
        </span>
      ),
      ...(preview || {}),
    };
    return <AntImage className={cls} preview={mergedPreview} {...rest} />;
  }

  OmadaImage.PreviewGroup = AntImage.PreviewGroup;

  window.Omada = window.Omada || {};
  window.Omada.Image = OmadaImage;
})();
