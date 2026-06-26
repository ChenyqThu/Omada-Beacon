/* components/ColorPicker/ColorPicker.demo.jsx — window.OmadaDemos.ColorPicker */
(function () {
  const { ColorPicker } = window.Omada;

  function ColorPickerDemo() {
    const { t } = window.useOmada();

    return (
      <>
        <div className="row">
          <span className="label">{t('color.led')}</span>
          <ColorPicker defaultValue="#00A870" showText />
        </div>
        <div className="row">
          <span className="label">{t('color.tag')}</span>
          <ColorPicker defaultValue="#0069CB" showText allowClear
            format="hex" />
        </div>
        <div className="row">
          <span className="label">sizes</span>
          <ColorPicker defaultValue="#F476FF" size="small" />
          <ColorPicker defaultValue="#FF8C27" />
          <ColorPicker defaultValue="#EE385C" size="large" />
        </div>
        <div className="row">
          <span className="label">{t('color.gradient')}</span>
          <ColorPicker
            mode={['single', 'gradient']}
            defaultValue={[
              { color: '#00A870', percent: 0 },
              { color: '#0069CB', percent: 100 },
            ]}
            showText
          />
        </div>
        <div className="row">
          <span className="label">disabled</span>
          <ColorPicker defaultValue="#999999" disabled showText />
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.ColorPicker = ColorPickerDemo;
})();
