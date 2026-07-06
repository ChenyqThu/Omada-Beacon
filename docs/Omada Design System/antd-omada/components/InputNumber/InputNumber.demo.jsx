/* components/InputNumber/InputNumber.demo.jsx — window.OmadaDemos.InputNumber */
(function () {
  const { InputNumber } = window.Omada;

  function InputNumberDemo() {
    const { lang, t } = window.useOmada();
    return (
      <>
        <div className="row">
          <span className="label">basic</span>
          <InputNumber defaultValue={1500} style={{ width: 160 }} />
          <InputNumber defaultValue={1500} disabled style={{ width: 160 }} />
        </div>
        <div className="row">
          <span className="label">unit after</span>
          <InputNumber defaultValue={300} min={0} unit={t('units.mbps')} style={{ width: 180 }} />
          <InputNumber defaultValue={30} min={0} unit={t('units.minutes')} style={{ width: 180 }} />
        </div>
        <div className="row">
          <span className="label">unit before</span>
          <InputNumber defaultValue={1480} unitBefore="MTU" style={{ width: 180 }} />
        </div>
        <div className="row">
          <span className="label">formatted</span>
          <InputNumber
            defaultValue={1000}
            style={{ width: 200 }}
            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(v) => (v || '').replace(/,/g, '')}
          />
        </div>
        <div className="row">
          <span className="label">range 1–100</span>
          <InputNumber defaultValue={24} min={1} max={100} style={{ width: 160 }} />
          <span style={{ fontSize: 12, color: 'var(--fg-tertiary,#999)' }}>
            {lang === 'zh' ? '超出范围自动收敛' : 'clamps out-of-range values'}
          </span>
        </div>
        <div className="row">
          <span className="label">no controls</span>
          <InputNumber defaultValue={8080} controls={false} style={{ width: 160 }} />
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.InputNumber = InputNumberDemo;
})();
