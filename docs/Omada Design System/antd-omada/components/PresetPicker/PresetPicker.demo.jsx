/* components/PresetPicker/PresetPicker.demo.jsx — window.OmadaDemos.PresetPicker */
(function () {
  const PresetPicker = window.Omada.PresetPicker;

  function PresetPickerDemo() {
    const { useState } = React;
    const ctx = window.useOmada();
    const t = ctx.t;
    const [sel, setSel] = useState({ preset: '24h', range: null });
    const [selB, setSelB] = useState({ preset: '7d', range: null });

    return (
      <div className="omada-pp-demo">
        <div className="omada-pp-block">
          <span className="omada-pp-blocktitle">{t('pp.demo.dash')}</span>
          <PresetPicker
            defaultValue="24h"
            onChange={setSel}
          />
          <div className="omada-pp-readout">
            <span className="omada-pp-readlabel">{t('pp.demo.selected')}</span>
            <code className="omada-pp-readcode">{sel.preset}</code>
          </div>
        </div>

        <div className="omada-pp-block">
          <span className="omada-pp-blocktitle">{t('pp.demo.logs')}</span>
          <PresetPicker
            defaultValue="7d"
            showTime
            size="small"
            onChange={setSelB}
          />
          <div className="omada-pp-readout">
            <span className="omada-pp-readlabel">{t('pp.demo.selected')}</span>
            <code className="omada-pp-readcode">{selB.preset}</code>
          </div>
        </div>

        <p className="omada-pp-hint">{t('pp.demo.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.PresetPicker = PresetPickerDemo;
})();
