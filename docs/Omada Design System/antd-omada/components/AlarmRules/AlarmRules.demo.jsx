/* components/AlarmRules/AlarmRules.demo.jsx — window.OmadaDemos.AlarmRules */
(function () {
  const AlarmRules = window.Omada.AlarmRules;

  function AlarmRulesDemo() {
    const { useState } = React;
    const ctx = window.useOmada();
    const t = ctx.t;

    const [rules, setRules] = useState([
      { id: 'r1', enabled: true,  metric: 'cpu',     op: 'gt', value: 90,   sustain: 5,  severity: 'critical' },
      { id: 'r2', enabled: true,  metric: 'traffic', op: 'gt', value: 800,  sustain: 15, severity: 'warning' },
      { id: 'r3', enabled: false, metric: 'loss',    op: 'gt', value: 2,    sustain: 1,  severity: 'info' },
    ]);

    return (
      <div className="omada-alr-demo">
        <AlarmRules rules={rules} onChange={setRules} />
        <p className="omada-alr-pagehint">{t('alr.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.AlarmRules = AlarmRulesDemo;
})();
