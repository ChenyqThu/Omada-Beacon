/* components/Rate/Rate.demo.jsx — window.OmadaDemos.Rate */
(function () {
  const { Rate } = window.Omada;

  function RateDemo() {
    const { t } = window.useOmada();
    const [val, setVal] = React.useState(3);

    const tips = [t('rate.tip.1'), t('rate.tip.2'), t('rate.tip.3'), t('rate.tip.4'), t('rate.tip.5')];

    return (
      <>
        <div className="row"><span className="label">{t('rate.quality')}</span>
          <Rate value={val} onChange={setVal} tips={tips} />
          <span style={{ marginLeft: 14, fontSize: 13, color: 'var(--fg-secondary)' }}>
            {tips[val - 1] || '—'}
          </span>
        </div>

        <div className="row" style={{ marginTop: 8 }}><span className="label">{t('rate.allowHalf')}</span>
          <Rate allowHalf defaultValue={3.5} />
        </div>

        <div className="row" style={{ marginTop: 8 }}><span className="label">{t('rate.readonly')}</span>
          <Rate disabled defaultValue={4} />
        </div>

        <div className="row" style={{ marginTop: 8 }}><span className="label">count = 10</span>
          <Rate count={10} defaultValue={7} />
        </div>
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.Rate = RateDemo;
})();
