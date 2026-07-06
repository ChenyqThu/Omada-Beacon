/* components/ChartEmpty/ChartEmpty.demo.jsx — window.OmadaDemos.ChartEmpty */
(function () {
  const { ChartEmpty } = window.Omada;

  function ChartEmptyDemo() {
    const { t, lang } = window.useOmada();
    const L = (en, zh) => (lang === 'zh' ? zh : en);
    return (
      <>
        <div className="row"><span className="label">{L('frame-only empty state · 40% opacity', '仅框架空状态 · 透明度 40%')}</span></div>
        <div className="grid-2">
          <ChartEmpty type="line" title={t('chart.line')} />
          <ChartEmpty type="bar" title={t('chart.bar')} />
        </div>

        <div className="row" style={{ marginTop: 20 }}><span className="label">{L('donut · with legend frame', '环图 · 含图例框架')}</span></div>
        <ChartEmpty type="pie" title={t('chart.pie')} height={220} />

        <div className="row" style={{ marginTop: 20 }}><span className="label">{L('loading variant · gentle pulse', '加载变体 · 轻微脉冲')}</span></div>
        <ChartEmpty type="line" title={t('chart.line')} loading height={200} />

        <div className="row" style={{ marginTop: 20 }}><span className="label">{L('bare frame · no caption (e.g. behind a Spin)', '裸框架 · 无文案（如配合 Spin）')}</span></div>
        <ChartEmpty type="bar" showCaption={false} height={160} />
      </>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.ChartEmpty = ChartEmptyDemo;
})();
