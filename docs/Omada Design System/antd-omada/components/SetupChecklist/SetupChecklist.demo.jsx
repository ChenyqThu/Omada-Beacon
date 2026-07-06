/* components/SetupChecklist/SetupChecklist.demo.jsx — window.OmadaDemos.SetupChecklist */
(function () {
  const { useState } = React;
  const SetupChecklist = window.Omada.SetupChecklist;
  const Button = window.Omada.Button;
  const Icon = window.Omada.Icon;

  function SetupChecklistDemo() {
    const ctx = window.useOmada();
    const t = ctx.t;

    const base = [
      { key: 'controller', title: t('suc.s.controller'), desc: t('suc.d.controller'), cta: t('suc.c.controller') },
      { key: 'devices',    title: t('suc.s.devices'),    desc: t('suc.d.devices'),    cta: t('suc.c.devices') },
      { key: 'wifi',       title: t('suc.s.wifi'),       desc: t('suc.d.wifi'),       cta: t('suc.c.wifi') },
      { key: 'team',       title: t('suc.s.team'),       desc: t('suc.d.team'),       cta: t('suc.c.team'), optional: true },
    ];
    const [items, setItems] = useState(function () {
      return base.map(function (x, i) { return Object.assign({}, x, { done: i === 0 }); });
    });

    const run = function (key) {
      setItems(function (arr) { return arr.map(function (x) { return x.key === key ? Object.assign({}, x, { done: true }) : x; }); });
    };
    const reset = function () {
      setItems(base.map(function (x, i) { return Object.assign({}, x, { done: i === 0 }); }));
    };

    return (
      <div className="omada-suc-demo">
        <SetupChecklist
          items={items}
          onRun={run}
          finishCta={t('suc.c.finish')}
          onFinish={reset}
        />
        <div className="omada-suc-replay">
          <Button variant="text" size="small" onClick={reset}>
            <Icon name="refresh" size={14} />{t('suc.reset')}
          </Button>
        </div>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.SetupChecklist = SetupChecklistDemo;
})();
