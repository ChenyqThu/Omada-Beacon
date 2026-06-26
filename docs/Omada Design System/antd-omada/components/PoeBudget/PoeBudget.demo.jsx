/* components/PoeBudget/PoeBudget.demo.jsx — window.OmadaDemos.PoeBudget */
(function () {
  const PoeBudget = window.Omada.PoeBudget;

  function PoeBudgetDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;
    return (
      <div className="omada-b28-demo">
        <div className="omada-b28-blocktitle">{t('poe.b.switch')}</div>
        <PoeBudget defaultBudget={65} />
        <p className="omada-b28-pagehint">{t('poe.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.PoeBudget = PoeBudgetDemo;
})();
