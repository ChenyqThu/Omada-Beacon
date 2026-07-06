/* components/Slider/Slider.demo.jsx — window.OmadaDemos.Slider */
(function () {
  const { Slider } = window.Omada;

  function SliderDemo() {
    const { t } = window.useOmada();

    const brightnessMarks = { 0: '0', 25: '25', 50: '50', 75: '75', 100: '100' };
    const channelMarks = { 36: '36', 44: '44', 149: '149', 157: '157', 165: '165' };

    return (
      <div className="grid-2" style={{ alignItems: 'start', gap: '24px 40px' }}>
        <div>
          <div className="row"><span className="label">{t('slider.bandwidth')}</span></div>
          <Slider defaultValue={60} unit={t('units.mbps')} />

          <div className="row" style={{ marginTop: 18 }}><span className="label">{t('slider.brightness')}</span></div>
          <Slider defaultValue={50} marks={brightnessMarks} unit="%" />

          <div className="row" style={{ marginTop: 26 }}><span className="label">{t('slider.range')}</span></div>
          <Slider range defaultValue={[44, 157]} marks={channelMarks} step={null}
            min={36} max={165} tooltip={{ open: false }} />
        </div>

        <div>
          <div className="row"><span className="label">disabled</span></div>
          <Slider defaultValue={40} disabled unit="%" />

          <div className="row" style={{ marginTop: 18 }}><span className="label">{t('slider.txpower')}</span></div>
          <Slider range defaultValue={[20, 80]} unit="dBm" />

          <div className="row" style={{ marginTop: 18 }}><span className="label">vertical</span></div>
          <div style={{ height: 160, display: 'flex', gap: 28, paddingLeft: 8 }}>
            <Slider vertical defaultValue={70} unit="%" />
            <Slider vertical range defaultValue={[30, 80]} />
            <Slider vertical defaultValue={45} marks={brightnessMarks} />
          </div>
        </div>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Slider = SliderDemo;
})();
