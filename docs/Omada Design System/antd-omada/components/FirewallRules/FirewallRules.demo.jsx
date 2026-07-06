/* components/FirewallRules/FirewallRules.demo.jsx — window.OmadaDemos.FirewallRules */
(function () {
  const FirewallRules = window.Omada.FirewallRules;

  function FirewallRulesDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;
    return (
      <div className="omada-b28-demo">
        <div className="omada-b28-blocktitle">{t('acl.b.rules')}</div>
        <FirewallRules />
        <p className="omada-b28-pagehint">{t('acl.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.FirewallRules = FirewallRulesDemo;
})();
