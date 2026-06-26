/* components/ImageField/ImageField.demo.jsx — window.OmadaDemos.ImageField */
(function () {
  const ImageField = window.Omada.ImageField;
  const Icon = window.Omada.Icon;
  const { Segmented, App } = window.antd;

  // generated striped-swatch data URLs so previews are visible without a real drop
  function swatch(c1, c2, label) {
    const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>"
      + "<defs><pattern id='p' width='14' height='14' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'>"
      + "<rect width='14' height='14' fill='" + c1 + "'/><rect width='7' height='14' fill='" + c2 + "'/></pattern></defs>"
      + "<rect width='160' height='160' fill='url(#p)'/>"
      + "<text x='80' y='86' font-family='monospace' font-size='13' fill='rgba(255,255,255,0.92)' text-anchor='middle'>" + label + "</text></svg>";
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  function ImageFieldDemo() {
    const { useState } = React;
    const ctx = window.useOmada();
    const t = ctx.t;
    const appApi = App.useApp ? App.useApp() : null;
    const msg = appApi && appApi.message ? appApi.message : { error: () => {}, warning: () => {} };

    const [avatar, setAvatar] = useState({ id: 'a0', url: swatch('#00A870', '#0A5A5A', 'AV') });
    const [gallery, setGallery] = useState([
      { id: 'g1', url: swatch('#2A6FDB', '#0A3A7A', '01'), name: 'lobby.jpg' },
      { id: 'g2', url: swatch('#C84BD6', '#5A1A6A', '02'), name: 'rack.jpg' },
      { id: 'g3', url: swatch('#E89C1C', '#7A4A0A', '03'), name: 'patch.jpg' },
    ]);
    const [shape, setShape] = useState('circle');

    const onError = (reason) => {
      if (reason === 'type') msg.error(t('imgf.err.type'));
      else if (reason === 'size') msg.error(t('imgf.err.size'));
      else if (reason === 'max') msg.warning(t('imgf.err.max'));
    };

    return (
      <div className="omada-imgf-demo">
        <div className="omada-imgf-block">
          <div className="omada-imgf-blockhead">
            <span className="omada-imgf-blocktitle">{t('imgf.b.avatar')}</span>
            <Segmented
              size="small" value={shape} onChange={setShape}
              options={[
                { value: 'circle', label: t('imgf.shape.circle') },
                { value: 'rounded', label: t('imgf.shape.rounded') },
              ]}
            />
          </div>
          <div className="omada-imgf-avatarrow">
            <ImageField mode="avatar" shape={shape} value={avatar} onChange={setAvatar} onError={onError} />
            <p className="omada-imgf-blockhint">{t('imgf.avatar.hint')}</p>
          </div>
        </div>

        <div className="omada-imgf-block">
          <span className="omada-imgf-blocktitle">{t('imgf.b.gallery')}</span>
          <ImageField mode="gallery" value={gallery} onChange={setGallery} max={6} onError={onError} />
        </div>

        <p className="omada-imgf-pagehint">
          <Icon name="info" size={13} />{t('imgf.hint')}
        </p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.ImageField = ImageFieldDemo;
})();
