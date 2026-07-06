/* components/WhatsNew/WhatsNew.demo.jsx — window.OmadaDemos.WhatsNew */
(function () {
  const WhatsNew = window.Omada.WhatsNew;
  const Icon = window.Omada.Icon;
  const { Button } = window.antd;

  function WhatsNewDemo() {
    const { useState } = React;
    const ctx = window.useOmada();
    const t = ctx.t;

    // newest-first; ids are stable forever
    const entries = [
      { id: 'r-5-14', version: '5.14', date: t('wn.e1.date'), title: t('wn.e1.title'),
        changes: [
          { tag: 'new', items: [t('wn.e1.n1'), t('wn.e1.n2')] },
          { tag: 'improved', items: [t('wn.e1.i1')] },
        ] },
      { id: 'r-5-13', version: '5.13', date: t('wn.e2.date'), title: t('wn.e2.title'),
        changes: [
          { tag: 'improved', items: [t('wn.e2.i1'), t('wn.e2.i2')] },
          { tag: 'fixed', items: [t('wn.e2.f1')] },
        ] },
      { id: 'r-5-12', version: '5.12', date: t('wn.e3.date'), title: t('wn.e3.title'),
        changes: [
          { tag: 'new', items: [t('wn.e3.n1')] },
          { tag: 'fixed', items: [t('wn.e3.f1'), t('wn.e3.f2')] },
        ] },
    ];

    // remount the all-in-one so the badge recomputes after we clear lastseen
    const [nonce, setNonce] = useState(0);
    const reset = () => { WhatsNew.resetSeen(); setNonce((n) => n + 1); };

    return (
      <div className="omada-wn-demo">
        <div className="omada-wn-demobar">
          <WhatsNew key={nonce} entries={entries} />
          <Button type="text" size="small"
                  icon={<Icon name="refresh" size={14} />} onClick={reset}>
            {t('wn.demo.reset')}
          </Button>
        </div>
        <p className="omada-wn-demohint">{t('wn.demo.hint')}</p>
      </div>
    );
  }

  window.OmadaDemos = window.OmadaDemos || {};
  window.OmadaDemos.WhatsNew = WhatsNewDemo;
})();
